import { getAuthUser, requireOrderAccess } from "@/lib/auth";
import { handleError } from "@/lib/handlers/error";
import { GetLatestDetection } from "@/services/iot.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = getAuthUser(req);
    requireOrderAccess(user);

    const { orderId } = await params;
    const log = await GetLatestDetection(user, orderId);

    return NextResponse.json(log);
  } catch (error) {
    return handleError(error);
  }
}
