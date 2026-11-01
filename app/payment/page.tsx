"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessPayment } from "@/components/cashier/processpayment";

const CURRENT_ORDER_KEY = "pos.currentOrder";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type StoredOrder = {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
};

const EMPTY_ORDER: StoredOrder = { items: [], subtotal: 0, tax: 0, total: 0 };

function readStoredOrder(): StoredOrder {
  if (typeof window === "undefined") return EMPTY_ORDER;

  try {
    const raw = sessionStorage.getItem(CURRENT_ORDER_KEY);
    if (!raw) return EMPTY_ORDER;

    const parsed = JSON.parse(raw) as Partial<StoredOrder>;
    return {
      items: parsed.items ?? [],
      subtotal: parsed.subtotal ?? 0,
      tax: parsed.tax ?? 0,
      total: parsed.total ?? 0,
    };
  } catch (err) {
    console.error("Failed to load order from session storage", err);
    return EMPTY_ORDER;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const [order] = useState<StoredOrder>(readStoredOrder);

  return (
    <ProcessPayment
      orderItems={order.items}
      subtotal={order.subtotal}
      tax={order.tax}
      total={order.total}
      onBack={() => router.push("/cashier")}
      onPaymentComplete={() => {
        sessionStorage.removeItem(CURRENT_ORDER_KEY);
        router.push("/cashier");
      }}
    />
  );
}
