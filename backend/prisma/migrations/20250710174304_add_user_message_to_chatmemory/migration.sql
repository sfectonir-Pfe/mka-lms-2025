/*
  Warnings:

  - Added the required column `userMessage` to the `ChatMemory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMemory" ADD COLUMN     "userMessage" TEXT NOT NULL;
