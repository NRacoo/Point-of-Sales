import { NextRequest } from "next/server";
import { UnauthorizedError } from "@/lib/auth";

const DEVICE_KEY = process.env.IOT_DEVICE_KEY;

/**
 * Raspberry Pi tidak punya cookie session seperti browser, jadi dia
 * mengirim header `x-device-key` yang dicocokkan dengan IOT_DEVICE_KEY.
 */
export function requireDevice(req: NextRequest) {
  if (!DEVICE_KEY) {
    throw new Error("IOT_DEVICE_KEY belum di-set di environment variables");
  }

  const key = req.headers.get("x-device-key");
  if (!key || key !== DEVICE_KEY) {
    throw new UnauthorizedError("Device key tidak valid");
  }
}
