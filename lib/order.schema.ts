import { z } from "zod";

// enum sesuai schema.prisma asli
export const PaymentMethodEnum = z.enum(["cash", "QRIS", "card"]);
export const OrderStatusEnum = z.enum(["pending", "completed", "cancelled"]);

const numericString = (opts?: { min?: number }) =>
  z
    .string()
    .refine((v) => !isNaN(Number(v)) && isFinite(Number(v)), {
      message: "Harus berupa angka valid",
    })
    .refine((v) => (opts?.min === undefined ? true : Number(v) >= opts.min), {
      message: `Nilai minimal ${opts?.min}`,
    });

export const orderItemInputSchema = z.object({
  productId: z.string().uuid(),
  quantity: numericString({ min: 1 }),
});

export const createOrderSchema = z.object({
  storeId: z.string().uuid().optional(),
  customer_name: z.string().min(1).max(255),
  payment_method: PaymentMethodEnum,
  items: z.array(orderItemInputSchema).min(1, "Minimal 1 item"),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: OrderStatusEnum,
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const listOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: OrderStatusEnum.optional(),
  storeId: z.string().uuid().optional(), 
  search: z.string().optional(), 
});
export type ListOrderQuery = z.infer<typeof listOrderQuerySchema>;