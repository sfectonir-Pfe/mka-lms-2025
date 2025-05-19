-- DropForeignKey
ALTER TABLE "Contenu" DROP CONSTRAINT "Contenu_courseId_fkey";

-- AddForeignKey
ALTER TABLE "Contenu" ADD CONSTRAINT "Contenu_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
