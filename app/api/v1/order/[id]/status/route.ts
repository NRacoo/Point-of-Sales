import { getAuthUser, requireOrderAccess } from "@/lib/auth";
import { handleError } from "@/lib/handlers/error";
import { updateOrderStatusSchema } from "@/lib/order.schema";
import { UpdateOrderStatus } from "@/services/order.service";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = getAuthUser(req);
    requireOrderAccess(user);

    const { id } = await params;
    const body = await req.json();
    const input = updateOrderStatusSchema.parse(body);
    const order = await UpdateOrderStatus(user, id, input);

    return NextResponse.json(order);
  } catch (error) {
    return handleError(error);
  }
}
