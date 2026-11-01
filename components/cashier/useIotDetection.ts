"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { payment_method } from "@/app/generated/prisma/client";
import { armDetection, getDetectionStatus, type PaymentEventLog } from "@/lib/api/iot";

const POLL_INTERVAL_MS = 2000;
const TERMINAL: PaymentEventLog["status"][] = [
  "confirmed",
  "mismatch",
  "failed",
];

/**
 * Mengaktifkan deteksi pembayaran di Raspberry Pi lalu polling hasilnya
 * sampai status terminal. Polling berhenti otomatis saat unmount.
 */
export function useIotDetection() {
  const [log, setLog] = useState<PaymentEventLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isArming, setIsArming] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeOrderRef = useRef<string | null>(null);

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stopPolling, [stopPolling]);

  const poll = useCallback(
    (orderId: string) => {
      stopPolling();

      timerRef.current = setInterval(async () => {
        if (activeOrderRef.current !== orderId) {
          stopPolling();
          return;
        }

        try {
          const next = await getDetectionStatus(orderId);
          if (activeOrderRef.current !== orderId) return;

          setLog(next);
          if (TERMINAL.includes(next.status)) stopPolling();
        } catch (err) {
          // Error polling tidak fatal: siklus berikutnya akan mencoba lagi.
          console.error("Polling deteksi IoT gagal", err);
        }
      }, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const arm = useCallback(
    async (orderId: string, method: payment_method) => {
      stopPolling();
      activeOrderRef.current = orderId;
      setError(null);
      setIsArming(true);

      try {
        const created = await armDetection({
          orderId,
          method_selected: method,
        });
        setLog(created);

        if (created.status === "awaiting") poll(orderId);
        return created;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengaktifkan deteksi");
        setLog(null);
        return null;
      } finally {
        setIsArming(false);
      }
    },
    [poll, stopPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    activeOrderRef.current = null;
    setLog(null);
    setError(null);
  }, [stopPolling]);

  return { log, error, isArming, arm, reset };
}
