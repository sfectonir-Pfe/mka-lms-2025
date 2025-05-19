/*
  Warnings:

  - You are about to drop the column `courseId` on the `Contenu` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contenu" DROP CONSTRAINT "Contenu_courseId_fkey";

-- AlterTable
ALTER TABLE "Contenu" DROP COLUMN "courseId";

-- CreateTable
CREATE TABLE "CourseContenu" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "contenuId" INTEGER NOT NULL,

    CONSTRAINT "CourseContenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseContenu_courseId_contenuId_key" ON "CourseContenu"("courseId", "contenuId");

-- AddForeignKey
ALTER TABLE "CourseContenu" ADD CONSTRAINT "CourseContenu_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseContenu" ADD CONSTRAINT "CourseContenu_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
