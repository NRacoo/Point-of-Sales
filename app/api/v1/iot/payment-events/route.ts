import { getAuthUser, requireOrderAccess } from "@/lib/auth";
import { handleError } from "@/lib/handlers/error";
import { requireDevice } from "@/lib/iot-auth";
import { detectionCallbackSchema, eventLogQuerySchema } from "@/lib/iot.schema";
import { ListPaymentEventLogs, RecordDetection } from "@/services/iot.service";
import { NextRequest, NextResponse } from "next/server";

/** Callback dari Raspberry Pi: metode pembayaran yang terdeteksi. */
export async function POST(req: NextRequest) {
  try {
    requireDevice(req);

    const body = await req.json();
    const input = detectionCallbackSchema.parse(body);
    const log = await RecordDetection(input);

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

/** Riwayat log untuk kasir/admin. */
export async function GET(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    requireOrderAccess(user);

    const { searchParams } = new URL(req.url);
    const query = eventLogQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await ListPaymentEventLogs(user, query);

    return NextResponse.json(result);
  } catch (error) {
    return handleError(error);
  }
}
