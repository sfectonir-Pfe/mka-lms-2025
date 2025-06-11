-- CreateTable
CREATE TABLE "Session2Module" (
    "id" SERIAL NOT NULL,
    "session2Id" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "Session2Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session2Course" (
    "id" SERIAL NOT NULL,
    "session2ModuleId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Session2Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session2Contenu" (
    "id" SERIAL NOT NULL,
    "session2CourseId" INTEGER NOT NULL,
    "contenuId" INTEGER NOT NULL,

    CONSTRAINT "Session2Contenu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session2Course_session2ModuleId_courseId_key" ON "Session2Course"("session2ModuleId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Session2Contenu_session2CourseId_contenuId_key" ON "Session2Contenu"("session2CourseId", "contenuId");

-- AddForeignKey
ALTER TABLE "Session2Module" ADD CONSTRAINT "Session2Module_session2Id_fkey" FOREIGN KEY ("session2Id") REFERENCES "Session2"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2Module" ADD CONSTRAINT "Session2Module_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2Course" ADD CONSTRAINT "Session2Course_session2ModuleId_fkey" FOREIGN KEY ("session2ModuleId") REFERENCES "Session2Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2Course" ADD CONSTRAINT "Session2Course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2Contenu" ADD CONSTRAINT "Session2Contenu_session2CourseId_fkey" FOREIGN KEY ("session2CourseId") REFERENCES "Session2Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session2Contenu" ADD CONSTRAINT "Session2Contenu_contenuId_fkey" FOREIGN KEY ("contenuId") REFERENCES "Contenu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
