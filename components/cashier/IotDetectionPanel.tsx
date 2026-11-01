"use client";

import { Loader2, Radio, CheckCircle2, AlertTriangle, WifiOff } from "lucide-react";
import { METHOD_LABEL, type PaymentEventLog } from "@/lib/api/iot";

interface IotDetectionPanelProps {
  log: PaymentEventLog | null;
  error: string | null;
  onRetry: () => void;
}

export function IotDetectionPanel({ log, error, onRetry }: IotDetectionPanelProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <WifiOff className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm text-red-800">Deteksi IoT tidak aktif</p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
            <p className="mt-1 text-xs text-red-700">
              Pembayaran masih bisa diselesaikan manual.
            </p>
          </div>
          <button
            onClick={onRetry}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-100"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  if (!log) return null;

  if (log.status === "awaiting") {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <div>
            <p className="text-sm text-blue-800">
              Menunggu Raspberry Pi mendeteksi pembayaran...
            </p>
            <p className="text-xs text-blue-700">
              Metode dipilih: {METHOD_LABEL[log.method_selected]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (log.status === "confirmed") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-green-800">
              Pembayaran terdeteksi &amp; cocok
            </p>
            <p className="text-xs text-green-700">
              Terdeteksi: {log.method_detected ? METHOD_LABEL[log.method_detected] : "-"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (log.status === "mismatch") {
    return (
      <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-900">Metode pembayaran tidak cocok</p>
            <p className="mt-1 text-xs text-yellow-800">
              Kasir memilih <b>{METHOD_LABEL[log.method_selected]}</b>, perangkat
              mendeteksi{" "}
              <b>
                {log.method_detected ? METHOD_LABEL[log.method_detected] : "tidak diketahui"}
              </b>
              . Mohon verifikasi sebelum menyelesaikan transaksi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // failed
  return (
    <div className="rounded-lg border border-gray-300 bg-gray-50 p-4">
      <div className="flex items-start gap-3">
        <Radio className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
        <div className="flex-1">
          <p className="text-sm text-gray-800">Deteksi gagal</p>
          <p className="mt-1 text-xs text-gray-600">
            {log.note ?? "Perangkat tidak merespons."} Pembayaran masih bisa
            diselesaikan manual.
          </p>
        </div>
        <button
          onClick={onRetry}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
