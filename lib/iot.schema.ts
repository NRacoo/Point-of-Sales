import { z } from "zod";
import { PaymentMethodEnum } from "@/lib/order.schema";

export const IotEventStatusEnum = z.enum([
  "awaiting",
  "detected",
  "confirmed",
  "mismatch",
  "failed",
]);

/** Dipakai kasir saat membuka halaman payment: minta Pi mulai mendeteksi. */
export const armDetectionSchema = z.object({
  orderId: z.string().uuid(),
  method_selected: PaymentMethodEnum,
});
export type ArmDetectionInput = z.infer<typeof armDetectionSchema>;

/** Dipakai Raspberry Pi saat callback hasil deteksi. */
export const detectionCallbackSchema = z.object({
  orderId: z.string().uuid(),
  method_detected: PaymentMethodEnum,
  note: z.string().max(500).optional(),
});
export type DetectionCallbackInput = z.infer<typeof detectionCallbackSchema>;

/** Dipakai Pi kalau deteksi gagal / timeout. */
export const detectionFailureSchema = z.object({
  orderId: z.string().uuid(),
  note: z.string().max(500).optional(),
});
export type DetectionFailureInput = z.infer<typeof detectionFailureSchema>;

export const eventLogQuerySchema = z.object({
  orderId: z.string().uuid().optional(),
  status: IotEventStatusEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type EventLogQuery = z.infer<typeof eventLogQuerySchema>;
