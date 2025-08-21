/*
  Warnings:

  - A unique constraint covering the columns `[fromStudentId,toStudentId,groupId,category]` on the table `StudentFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."StudentFeedback_fromStudentId_toStudentId_groupId_key";

-- CreateTable
CREATE TABLE "public"."ProgramChatMessage" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "senderId" INTEGER,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudentFeedback_groupId_fromStudentId_idx" ON "public"."StudentFeedback"("groupId", "fromStudentId");

-- CreateIndex
CREATE INDEX "StudentFeedback_groupId_toStudentId_idx" ON "public"."StudentFeedback"("groupId", "toStudentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentFeedback_fromStudentId_toStudentId_groupId_category_key" ON "public"."StudentFeedback"("fromStudentId", "toStudentId", "groupId", "category");

-- AddForeignKey
ALTER TABLE "public"."ProgramChatMessage" ADD CONSTRAINT "ProgramChatMessage_programId_fkey" FOREIGN KEY ("programId") REFERENCES "public"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProgramChatMessage" ADD CONSTRAINT "ProgramChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
