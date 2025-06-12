-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiryDate" TIMESTAMP(3),
ADD COLUMN     "emailVerificationCode" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3);
