/*
  Warnings:

  - A unique constraint covering the columns `[fromStudentId,toStudentId,groupId]` on the table `StudentFeedback` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "StudentFeedback_fromStudentId_toStudentId_groupId_category_key";

-- DropIndex
DROP INDEX "StudentFeedback_groupId_fromStudentId_idx";

-- DropIndex
DROP INDEX "StudentFeedback_groupId_toStudentId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "StudentFeedback_fromStudentId_toStudentId_groupId_key" ON "StudentFeedback"("fromStudentId", "toStudentId", "groupId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
