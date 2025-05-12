-- DropForeignKey
ALTER TABLE "Module" DROP CONSTRAINT "Module_programId_fkey";

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
