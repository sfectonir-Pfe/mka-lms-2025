/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionContenu` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SessionModule` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_programId_fkey";

-- DropForeignKey
ALTER TABLE "SessionContenu" DROP CONSTRAINT "SessionContenu_contenuId_fkey";

-- DropForeignKey
ALTER TABLE "SessionContenu" DROP CONSTRAINT "SessionContenu_sessionCourseId_fkey";

-- DropForeignKey
ALTER TABLE "SessionCourse" DROP CONSTRAINT "SessionCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "SessionCourse" DROP CONSTRAINT "SessionCourse_sessionModuleId_fkey";

-- DropForeignKey
ALTER TABLE "SessionModule" DROP CONSTRAINT "SessionModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "SessionModule" DROP CONSTRAINT "SessionModule_sessionId_fkey";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "SessionContenu";

-- DropTable
DROP TABLE "SessionCourse";

-- DropTable
DROP TABLE "SessionModule";

-- CreateTable
CREATE TABLE "buildProgram" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "imageUrl" TEXT,
    "level" TEXT NOT NULL DEFAULT 'Basique',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buildProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildProgramModule" (
    "id" SERIAL NOT NULL,
    "buildProgramId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "buildProgramModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildProgramCourse" (
    "id" SERIAL NOT NULL,
    "buildProgramModuleId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "buildProgramCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildProgramContenu" (
    "id" SERIAL NOT NULL,
    "buildProgramCourseId" INTEGER NOT NULL,
    "contenuId" INTEGER NOT NULL,

    CONSTRAINT "buildProgramContenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buildProgramModule_buildProgramId_moduleId_key" ON "buildProgramModule"("buildProgramId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "buildProgramCourse_buildProgramModuleId_courseId_key" ON "buildProgramCourse"("buildProgramModuleId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "buildProgramContenu_buildProgramCourseId_contenuId_key" ON "buildProgramContenu"("buildProgramCourseId", "contenuId");

-- AddForeignKey
ALTER TABLE "buildProgram" ADD CONSTRAINT "buildProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramModule" ADD CONSTRAINT "buildProgramModule_buildProgramId_fkey" FOREIGN KEY ("buildProgramId") REFERENCES "buildProgram"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramModule" ADD CONSTRAINT "buildProgramModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramCourse" ADD CONSTRAINT "buildProgramCourse_buildProgramModuleId_fkey" FOREIGN KEY ("buildProgramModuleId") REFERENCES "buildProgramModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramCourse" ADD CONSTRAINT "buildProgramCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramContenu" ADD CONSTRAINT "buildProgramContenu_buildProgramCourseId_fkey" FOREIGN KEY ("buildProgramCourseId") REFERENCES "buildProgramCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildProgramContenu" ADD CONSTRAINT "buildProgramContenu_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
