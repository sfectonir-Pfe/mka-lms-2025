/*
  Warnings:

  - A unique constraint covering the columns `[fromStudentId,toStudentId,groupId,category]` on the table `StudentFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudentFeedback_fromStudentId_toStudentId_groupId_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudentFeedback_fromStudentId_toStudentId_groupId_category_key" ON "StudentFeedback"("fromStudentId", "toStudentId", "groupId", "category");

-- AddForeignKey
ALTER TABLE "SeanceFeedback" ADD CONSTRAINT "SeanceFeedback_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "SeanceFormateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionFeedback" ADD CONSTRAINT "SessionFeedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session2"("id") ON DELETE CASCADE ON UPDATE CASCADE;
