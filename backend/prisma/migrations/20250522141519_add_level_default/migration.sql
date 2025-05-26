/*
  Warnings:

  - You are about to drop the `CreateurDeFormation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CreateurDeFormation" DROP CONSTRAINT "CreateurDeFormation_userId_fkey";

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "level" TEXT NOT NULL DEFAULT 'Basique',
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "createdAt" DROP NOT NULL;

-- DropTable
DROP TABLE "CreateurDeFormation";

-- CreateTable
CREATE TABLE "Createur_De_Formation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Createur_De_Formation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Createur_De_Formation" ADD CONSTRAINT "Createur_De_Formation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
