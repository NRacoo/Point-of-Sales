/*
  Warnings:

  - Changed the type of `stock` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `reorder_level` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock",
ADD COLUMN     "stock" INTEGER NOT NULL,
DROP COLUMN "reorder_level",
ADD COLUMN     "reorder_level" INTEGER NOT NULL;
