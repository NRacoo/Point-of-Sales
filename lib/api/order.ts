import type { order_status, payment_method } from "@/app/generated/prisma/client";

export interface CreatedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: string;
  payment_method: payment_method;
  status: order_status;
}

async function parseError(res: Response, fallback: string) {
  try {
    const body = await res.json();
    return (body?.error as string) ?? fallback;
  } catch {
    return fallback;
  }
}

export async function createOrder(input: {
  customer_name: string;
  payment_method: payment_method;
  items: { productId: string; quantity: string }[];
  /** Wajib kalau yang checkout adalah admin; kasir memakai storeId dari token. */
  storeId?: string;
}): Promise<CreatedOrder> {
  const res = await fetch("/api/v1/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Gagal membuat order"));
  }
  return res.json();
}

export async function updateOrderStatus(
  orderId: string,
  status: order_status
): Promise<CreatedOrder> {
  const res = await fetch(`/api/v1/order/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error(await parseError(res, "Gagal memperbarui status order"));
  }
  return res.json();
}
