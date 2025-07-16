/*
  Warnings:

  - Added the required column `updatedAt` to the `Feedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "category" TEXT,
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
