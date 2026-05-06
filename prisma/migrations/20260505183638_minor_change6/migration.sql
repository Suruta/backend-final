/*
  Warnings:

  - You are about to drop the column `arrivalRadious` on the `route_stops` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "route_stops" DROP COLUMN "arrivalRadious",
ADD COLUMN     "arrivalRadius" INTEGER NOT NULL DEFAULT 100;
