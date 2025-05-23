-- Modifier la colonne fileUrl pour la rendre nullable
ALTER TABLE "Contenu" ALTER COLUMN "fileUrl" DROP NOT NULL;
