/*
  Warnings:

  - Added the required column `quantity` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auction_bids" ADD COLUMN     "quantity" INTEGER;

-- AlterTable
ALTER TABLE "food_items" ADD COLUMN     "availableQuantity" INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "quantity" INTEGER NOT NULL;
