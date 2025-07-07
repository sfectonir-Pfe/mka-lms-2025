/*
  Warnings:

  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_seanceId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropTable
DROP TABLE "ChatMessage";

-- CreateTable
CREATE TABLE "Session2ChatMessage" (
    "id" SERIAL NOT NULL,
    "session2Id" INTEGER NOT NULL,
    "senderId" INTEGER,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session2ChatMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Session2ChatMessage" ADD CONSTRAINT "Session2ChatMessage_session2Id_fkey" FOREIGN KEY ("session2Id") REFERENCES "Session2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2ChatMessage" ADD CONSTRAINT "Session2ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
