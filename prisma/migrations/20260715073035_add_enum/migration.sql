/*
  Warnings:

  - The values [out_stock] on the enum `product_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "product_status_new" AS ENUM ('in_stock', 'out_of_stock', 'low_stock');
ALTER TABLE "public"."Product" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "status" TYPE "product_status_new" USING ("status"::text::"product_status_new");
ALTER TYPE "product_status" RENAME TO "product_status_old";
ALTER TYPE "product_status_new" RENAME TO "product_status";
DROP TYPE "public"."product_status_old";
ALTER TABLE "Product" ALTER COLUMN "status" SET DEFAULT 'in_stock';
COMMIT;
