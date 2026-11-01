import type { payment_method } from "@/app/generated/prisma/client";

export type IotEventStatus =
  | "awaiting"
  | "detected"
  | "confirmed"
  | "mismatch"
  | "failed";

export interface PaymentEventLog {
  id: string;
  orderId: string;
  method_selected: payment_method;
  method_detected: payment_method | null;
  status: IotEventStatus;
  matched: boolean | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

/** Metode di UI -> enum payment_method di database. */
export const UI_METHOD_TO_DB: Record<string, payment_method> = {
  cash: "cash",
  card: "card",
  "e-wallet": "e_wallet",
  qris: "QRIS",
};

export const METHOD_LABEL: Record<payment_method, string> = {
  cash: "Cash",
  card: "Debit/Credit Card",
  e_wallet: "E-Wallet",
  QRIS: "QRIS",
};

async function parseError(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return (body?.error as string) ?? fallback;
  } catch {
    return fallback;
  }
}

/** Minta Raspberry Pi mulai mendeteksi pembayaran untuk order ini. */
export async function armDetection(input: {
  orderId: string;
  method_selected: payment_method;
}): Promise<PaymentEventLog> {
  const res = await fetch("/api/v1/iot/arm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Gagal mengaktifkan deteksi IoT"));
  }
  return res.json();
}

/** Ambil hasil deteksi terakhir, dipakai untuk polling. */
export async function getDetectionStatus(
  orderId: string
): Promise<PaymentEventLog> {
  const res = await fetch(`/api/v1/iot/status/${orderId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Gagal mengambil status deteksi"));
  }
  return res.json();
}
