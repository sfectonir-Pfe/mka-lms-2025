-- CreateTable
CREATE TABLE "SeanceMedia" (
    "id" SERIAL NOT NULL,
    "seanceId" INTEGER NOT NULL,
    "type" "FileType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeanceMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeanceMedia" ADD CONSTRAINT "SeanceMedia_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "SeanceFormateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
