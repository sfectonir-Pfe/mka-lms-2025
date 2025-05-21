/*
  Warnings:

  - Added the required column `fileUrl` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "fileUrl" TEXT NOT NULL,
ADD COLUMN     "type" "FileType" NOT NULL;
