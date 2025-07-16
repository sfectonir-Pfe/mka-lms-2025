/*
  Warnings:

  - Added the required column `messageId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WhiteboardAction" DROP CONSTRAINT "WhiteboardAction_seanceId_fkey";

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "messageId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "WhiteboardAction" ADD CONSTRAINT "WhiteboardAction_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "SeanceFormateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
