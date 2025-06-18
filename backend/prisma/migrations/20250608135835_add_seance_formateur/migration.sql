-- CreateTable
CREATE TABLE "SeanceFormateur" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "formateurId" INTEGER NOT NULL,
    "buildProgramId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeanceFormateur_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SeanceFormateur" ADD CONSTRAINT "SeanceFormateur_formateurId_fkey" FOREIGN KEY ("formateurId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeanceFormateur" ADD CONSTRAINT "SeanceFormateur_buildProgramId_fkey" FOREIGN KEY ("buildProgramId") REFERENCES "buildProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;
