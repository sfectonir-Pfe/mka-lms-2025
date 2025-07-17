-- CreateEnum
CREATE TYPE "Session2Status" AS ENUM ('ACTIVE', 'INACTIVE', 'COMPLETED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Session2" ADD COLUMN     "status" "Session2Status" NOT NULL DEFAULT 'ACTIVE';
