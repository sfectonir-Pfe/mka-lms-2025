/*
  Warnings:

  - You are about to drop the column `published` on the `CourseContenu` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contenu" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CourseContenu" DROP COLUMN "published";
