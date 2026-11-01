import { Prisma, payment_method } from "@/app/generated/prisma/client";
import { AuthUser } from "@/lib/auth";
import {
  ArmDetectionInput,
  DetectionCallbackInput,
  DetectionFailureInput,
  EventLogQuery,
} from "@/lib/iot.schema";
import { prisma } from "@/lib/prisma";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/services/order.service";

const DEVICE_URL = process.env.IOT_DEVICE_URL;
const DEVICE_KEY = process.env.IOT_DEVICE_KEY;
const DEVICE_TIMEOUT_MS = Number(process.env.IOT_DEVICE_TIMEOUT_MS ?? 5000);

async function findOrderForUser(orderId: string, user: AuthUser) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, storeId: true, status: true, order_number: true },
  });

  if (!order) throw new NotFoundError("Order not found");
  if (user.role === "cashier" && order.storeId !== user.storeId) {
    throw new ForbiddenError();
  }

  return order;
}

/**
 * Memberi tahu Raspberry Pi untuk mulai mendeteksi pembayaran.
 * Kegagalan jaringan ke device tidak membatalkan log: log tetap dibuat
 * dengan status `failed` supaya kasir tahu device-nya tidak merespons.
 */
async function notifyDevice(payload: {
  orderId: string;
  order_number: string;
  method_selected: payment_method;
}) {
  if (!DEVICE_URL) {
    return { ok: false, note: "IOT_DEVICE_URL belum dikonfigurasi" };
  }

  try {
    const res = await fetch(`${DEVICE_URL.replace(/\/$/, "")}/detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DEVICE_KEY ? { "x-device-key": DEVICE_KEY } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(DEVICE_TIMEOUT_MS),
    });

    if (!res.ok) {
      return { ok: false, note: `Device merespons dengan status ${res.status}` };
    }
    return { ok: true, note: undefined };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "unknown error";
    return { ok: false, note: `Device tidak dapat dihubungi: ${reason}` };
  }
}

/** Dipanggil kasir saat masuk halaman payment. */
export async function ArmPaymentDetection(user: AuthUser, input: ArmDetectionInput) {
  const order = await findOrderForUser(input.orderId, user);

  if (order.status !== "pending") {
    throw new BadRequestError(`Order dengan status ${order.status} tidak bisa dideteksi lagi`);
  }

  const device = await notifyDevice({
    orderId: order.id,
    order_number: order.order_number,
    method_selected: input.method_selected,
  });

  return prisma.paymentEventLog.create({
    data: {
      orderId: order.id,
      method_selected: input.method_selected,
      status: device.ok ? "awaiting" : "failed",
      note: device.note,
    },
  });
}

/**
 * Dipanggil Raspberry Pi lewat callback. Mencatat metode yang terdeteksi
 * dan menandai apakah cocok dengan pilihan kasir.
 */
export async function RecordDetection(input: DetectionCallbackInput) {
  return prisma.$transaction(async (tx) => {
    const log = await tx.paymentEventLog.findFirst({
      where: { orderId: input.orderId, status: "awaiting" },
      orderBy: { created_at: "desc" },
    });

    if (!log) {
      throw new NotFoundError("Tidak ada deteksi aktif untuk order ini");
    }

    const matched = log.method_selected === input.method_detected;

    return tx.paymentEventLog.update({
      where: { id: log.id },
      data: {
        method_detected: input.method_detected,
        matched,
        status: matched ? "confirmed" : "mismatch",
        note: input.note,
      },
    });
  });
}

/** Dipanggil Raspberry Pi kalau deteksi timeout atau error. */
export async function RecordDetectionFailure(input: DetectionFailureInput) {
  const log = await prisma.paymentEventLog.findFirst({
    where: { orderId: input.orderId, status: "awaiting" },
    orderBy: { created_at: "desc" },
  });

  if (!log) throw new NotFoundError("Tidak ada deteksi aktif untuk order ini");

  return prisma.paymentEventLog.update({
    where: { id: log.id },
    data: { status: "failed", note: input.note },
  });
}

/** Dipakai UI payment untuk polling hasil deteksi. */
export async function GetLatestDetection(user: AuthUser, orderId: string) {
  await findOrderForUser(orderId, user);

  const log = await prisma.paymentEventLog.findFirst({
    where: { orderId },
    orderBy: { created_at: "desc" },
  });

  if (!log) throw new NotFoundError("Belum ada event deteksi untuk order ini");

  return log;
}

/** Riwayat log, untuk halaman admin. */
export async function ListPaymentEventLogs(user: AuthUser, query: EventLogQuery) {
  const storeId = user.role === "cashier" ? user.storeId : undefined;

  const where: Prisma.PaymentEventLogWhereInput = {
    ...(query.orderId ? { orderId: query.orderId } : {}),
    ...(query.status ? { status: query.status } : {}),
    ...(storeId ? { order: { storeId } } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.paymentEventLog.findMany({
      where,
      include: {
        order: {
          select: { order_number: true, customer_name: true, total_amount: true },
        },
      },
      orderBy: { created_at: "desc" },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.paymentEventLog.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPage: Math.ceil(total / query.pageSize),
    },
  };
}
