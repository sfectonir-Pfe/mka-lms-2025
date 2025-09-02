-- AlterTable
ALTER TABLE "public"."Etablissement" ADD COLUMN     "etablissement2Id" INTEGER;

-- AlterTable
ALTER TABLE "public"."Etudiant" ADD COLUMN     "etablissement2Id" INTEGER;

-- CreateTable
CREATE TABLE "public"."Etablissement2" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Etablissement2_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Etudiant" ADD CONSTRAINT "Etudiant_etablissement2Id_fkey" FOREIGN KEY ("etablissement2Id") REFERENCES "public"."Etablissement2"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Etablissement" ADD CONSTRAINT "Etablissement_etablissement2Id_fkey" FOREIGN KEY ("etablissement2Id") REFERENCES "public"."Etablissement2"("id") ON DELETE SET NULL ON UPDATE CASCADE;
