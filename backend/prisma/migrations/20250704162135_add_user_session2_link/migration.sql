-- CreateTable
CREATE TABLE "UserSession2" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "session2Id" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession2_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSession2_userId_session2Id_key" ON "UserSession2"("userId", "session2Id");

-- AddForeignKey
ALTER TABLE "UserSession2" ADD CONSTRAINT "UserSession2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSession2" ADD CONSTRAINT "UserSession2_session2Id_fkey" FOREIGN KEY ("session2Id") REFERENCES "Session2"("id") ON DELETE CASCADE ON UPDATE CASCADE;
