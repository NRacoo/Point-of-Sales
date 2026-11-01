-- CreateEnum
CREATE TYPE "iot_event_status" AS ENUM ('awaiting', 'detected', 'confirmed', 'mismatch', 'failed');

-- AlterEnum
ALTER TYPE "payment_method" ADD VALUE 'e_wallet';

-- CreateTable
CREATE TABLE "PaymentEventLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "method_selected" "payment_method" NOT NULL,
    "method_detected" "payment_method",
    "status" "iot_event_status" NOT NULL DEFAULT 'awaiting',
    "matched" BOOLEAN,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentEventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PaymentEventLog_orderId_created_at_idx" ON "PaymentEventLog"("orderId", "created_at");

-- AddForeignKey
ALTER TABLE "PaymentEventLog" ADD CONSTRAINT "PaymentEventLog_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
