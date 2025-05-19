-- DropForeignKey
ALTER TABLE "ModuleCourse" DROP CONSTRAINT "ModuleCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleCourse" DROP CONSTRAINT "ModuleCourse_moduleId_fkey";

-- AddForeignKey
ALTER TABLE "ModuleCourse" ADD CONSTRAINT "ModuleCourse_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleCourse" ADD CONSTRAINT "ModuleCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
