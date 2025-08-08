-- CreateEnum
CREATE TYPE "ReclamationPriority" AS ENUM ('HAUTE', 'MOYENNE', 'BASSE');

-- CreateEnum
CREATE TYPE "ReclamationStatus" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'RESOLU', 'REJETE');

-- CreateTable
CREATE TABLE "Reclamation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "ReclamationPriority" NOT NULL DEFAULT 'MOYENNE',
    "status" "ReclamationStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "response" TEXT,
    "responseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reclamation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reclamation" ADD CONSTRAINT "Reclamation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
