-- CreateTable
CREATE TABLE "WhiteboardAction" (
    "id" SERIAL NOT NULL,
    "seanceId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "seanceMediaId" INTEGER,

    CONSTRAINT "WhiteboardAction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhiteboardAction" ADD CONSTRAINT "WhiteboardAction_seanceId_fkey" FOREIGN KEY ("seanceId") REFERENCES "SeanceFormateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteboardAction" ADD CONSTRAINT "WhiteboardAction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhiteboardAction" ADD CONSTRAINT "WhiteboardAction_seanceMediaId_fkey" FOREIGN KEY ("seanceMediaId") REFERENCES "SeanceMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
