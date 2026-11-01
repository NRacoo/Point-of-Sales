import { getAuthUser, requireOrderAccess } from "@/lib/auth";
import { handleError } from "@/lib/handlers/error";
import { armDetectionSchema } from "@/lib/iot.schema";
import { ArmPaymentDetection } from "@/services/iot.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const user = getAuthUser(req);
    requireOrderAccess(user);

    const body = await req.json();
    const input = armDetectionSchema.parse(body);
    const log = await ArmPaymentDetection(user, input);

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
