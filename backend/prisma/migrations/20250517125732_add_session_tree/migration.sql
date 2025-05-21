-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "programId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionModule" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "SessionModule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionCourse" (
    "id" SERIAL NOT NULL,
    "sessionModuleId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "SessionCourse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionContenu" (
    "id" SERIAL NOT NULL,
    "sessionCourseId" INTEGER NOT NULL,
    "contenuId" INTEGER NOT NULL,

    CONSTRAINT "SessionContenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SessionModule_sessionId_moduleId_key" ON "SessionModule"("sessionId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionCourse_sessionModuleId_courseId_key" ON "SessionCourse"("sessionModuleId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "SessionContenu_sessionCourseId_contenuId_key" ON "SessionContenu"("sessionCourseId", "contenuId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionModule" ADD CONSTRAINT "SessionModule_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionModule" ADD CONSTRAINT "SessionModule_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionCourse" ADD CONSTRAINT "SessionCourse_sessionModuleId_fkey" FOREIGN KEY ("sessionModuleId") REFERENCES "SessionModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionCourse" ADD CONSTRAINT "SessionCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionContenu" ADD CONSTRAINT "SessionContenu_sessionCourseId_fkey" FOREIGN KEY ("sessionCourseId") REFERENCES "SessionCourse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionContenu" ADD CONSTRAINT "SessionContenu_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
