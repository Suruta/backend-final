/*
  Warnings:

  - Changed the type of `entityId` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'ready');

-- AlterTable
ALTER TABLE "auction_bids" ADD COLUMN     "orderId" INTEGER;

-- AlterTable
ALTER TABLE "audit_logs" DROP COLUMN "entityId",
ADD COLUMN     "entityId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "auctionBidId" INTEGER NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_auctionBidId_key" ON "Order"("auctionBidId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_auctionBidId_fkey" FOREIGN KEY ("auctionBidId") REFERENCES "auction_bids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
