/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `programId` on the `Module` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PDF', 'IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "ContenuType" AS ENUM ('Cours', 'Exercice', 'Quiz');

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_programId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "fileUrl",
DROP COLUMN "moduleId",
DROP COLUMN "type";

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "programId";

-- DropEnum
DROP TYPE "CourseType";

-- CreateTable
CREATE TABLE "Mail" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "Mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contenu" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" "FileType" NOT NULL,
    "type" "ContenuType" NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Contenu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramModule" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "ProgramModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleCourse" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "ModuleCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mail_email_key" ON "Mail"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramModule_programId_moduleId_key" ON "ProgramModule"("programId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleCourse_moduleId_courseId_key" ON "ModuleCourse"("moduleId", "courseId");

-- AddForeignKey
ALTER TABLE "Contenu" ADD CONSTRAINT "Contenu_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramModule" ADD CONSTRAINT "ProgramModule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramModule" ADD CONSTRAINT "ProgramModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleCourse" ADD CONSTRAINT "ModuleCourse_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleCourse" ADD CONSTRAINT "ModuleCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
