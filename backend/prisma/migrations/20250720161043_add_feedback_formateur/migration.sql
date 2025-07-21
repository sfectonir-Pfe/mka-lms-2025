-- CreateTable
CREATE TABLE "FeedbackFormateur" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "emojiLabel" TEXT NOT NULL,
    "commentaire" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "FeedbackFormateur_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeedbackFormateur" ADD CONSTRAINT "FeedbackFormateur_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
