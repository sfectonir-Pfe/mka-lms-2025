/*
  Warnings:

  - You are about to drop the column `endDate` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Module` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Module` table without a default value. This is not possible if the table is not empty.
  - Added the required column `periodUnit` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PeriodUnit" AS ENUM ('Day', 'Week', 'Month');

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "periodUnit" "PeriodUnit" NOT NULL;
