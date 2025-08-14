-- AlterTable
ALTER TABLE "FeedbackList" ADD COLUMN     "email" TEXT,
ADD COLUMN     "nom" TEXT;

-- AddForeignKey
ALTER TABLE "SeanceFeedback" ADD CONSTRAINT "SeanceFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
