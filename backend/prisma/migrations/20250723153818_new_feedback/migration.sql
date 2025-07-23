/*
  Warnings:

  - You are about to drop the column `sessionDuration` on the `SeanceFeedback` table. All the data in the column will be lost.
  - The `wouldRecommend` column on the `SeanceFeedback` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionFeedback` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,seanceId]` on the table `SeanceFeedback` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `SeanceFeedback` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_userId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackResponse" DROP CONSTRAINT "FeedbackResponse_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "SessionFeedback" DROP CONSTRAINT "SessionFeedback_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "SessionFeedback" DROP CONSTRAINT "SessionFeedback_userId_fkey";

-- AlterTable
ALTER TABLE "SeanceFeedback" DROP COLUMN "sessionDuration",
ALTER COLUMN "userId" SET NOT NULL,
DROP COLUMN "wouldRecommend",
ADD COLUMN     "wouldRecommend" BOOLEAN;

-- DropTable
DROP TABLE "Feedback";

-- DropTable
DROP TABLE "FeedbackResponse";

-- DropTable
DROP TABLE "SessionFeedback";

-- CreateIndex
CREATE UNIQUE INDEX "SeanceFeedback_userId_seanceId_key" ON "SeanceFeedback"("userId", "seanceId");

-- AddForeignKey
ALTER TABLE "SeanceFeedback" ADD CONSTRAINT "SeanceFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
