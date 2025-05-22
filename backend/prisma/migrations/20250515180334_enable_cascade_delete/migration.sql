-- DropForeignKey
ALTER TABLE "ProgramModule" DROP CONSTRAINT "ProgramModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ProgramModule" DROP CONSTRAINT "ProgramModule_programId_fkey";

-- AddForeignKey
ALTER TABLE "ProgramModule" ADD CONSTRAINT "ProgramModule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramModule" ADD CONSTRAINT "ProgramModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
