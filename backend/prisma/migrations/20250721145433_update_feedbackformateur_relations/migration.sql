-- AlterTable
ALTER TABLE "FeedbackFormateur" ADD COLUMN     "formateurId" INTEGER;

-- AddForeignKey
ALTER TABLE "FeedbackFormateur" ADD CONSTRAINT "FeedbackFormateur_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackFormateur" ADD CONSTRAINT "FeedbackFormateur_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
