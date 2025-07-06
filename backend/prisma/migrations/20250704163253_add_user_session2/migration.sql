/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `UserSession2` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSession2" DROP COLUMN "assignedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
