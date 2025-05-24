-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('MCQ', 'TRUE_FALSE', 'FILL_BLANK', 'IMAGE_CHOICE');

-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_selectedId_fkey";

-- AlterTable
ALTER TABLE "Answer" ADD COLUMN     "textAnswer" TEXT,
ALTER COLUMN "selectedId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Choice" ADD COLUMN     "imageUrl" TEXT,
ALTER COLUMN "text" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "correctText" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "negativeMark" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "QuestionType" NOT NULL DEFAULT 'MCQ';

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "description" TEXT,
ADD COLUMN     "timeLimit" INTEGER,
ADD COLUMN     "title" TEXT;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_selectedId_fkey" FOREIGN KEY ("selectedId") REFERENCES "Choice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
