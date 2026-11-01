import { handleError } from "@/lib/handlers/error";
import { requireDevice } from "@/lib/iot-auth";
import { detectionFailureSchema } from "@/lib/iot.schema";
import { RecordDetectionFailure } from "@/services/iot.service";
import { NextRequest, NextResponse } from "next/server";

/** Dipanggil Raspberry Pi kalau deteksi timeout atau gagal. */
export async function POST(req: NextRequest) {
  try {
    requireDevice(req);

    const body = await req.json();
    const input = detectionFailureSchema.parse(body);
    const log = await RecordDetectionFailure(input);

    return NextResponse.json(log);
  } catch (error) {
    return handleError(error);
  }
}
