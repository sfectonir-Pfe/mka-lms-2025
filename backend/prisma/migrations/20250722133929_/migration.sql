-- AddForeignKey
ALTER TABLE "SeanceFeedback" ADD CONSTRAINT "SeanceFeedback_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "SeanceFormateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionFeedback" ADD CONSTRAINT "SessionFeedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session2"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
