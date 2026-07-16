"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProcessPayment } from "@/components/cashier/processpayment";

const CURRENT_ORDER_KEY = "pos.currentOrder";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function PaymentPage() {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CURRENT_ORDER_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as {
        items?: OrderItem[];
        subtotal?: number;
        tax?: number;
        total?: number;
      };

      if (parsed.items?.length) {
        setOrderItems(parsed.items);
      }
      setSubtotal(parsed.subtotal ?? 0);
      setTax(parsed.tax ?? 0);
      setTotal(parsed.total ?? 0);
    } catch (err) {
      console.error("Failed to load order from session storage", err);
    }
  }, []);

  return (
    <ProcessPayment
      orderItems={orderItems}
      subtotal={subtotal}
      tax={tax}
      total={total}
      onBack={() => router.push("/cashier")}
      onPaymentComplete={() => {}}
    />
  );
}
