/*
  Warnings:

  - The primary key for the `ClassUserQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `SetQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SetQuiz` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `ClassUserQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_q_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_s_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_s_id_fkey";

-- AlterTable
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_pkey",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ClassUserQuiz_pkey" PRIMARY KEY ("u_id", "c_id");

-- AlterTable
ALTER TABLE "SetQuiz" DROP CONSTRAINT "SetQuiz_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SetQuiz_pkey" PRIMARY KEY ("m_id");

-- CreateTable
CREATE TABLE "QuizList" (
    "q_id" BIGINT NOT NULL,
    "s_id" BIGINT NOT NULL,

    CONSTRAINT "QuizList_pkey" PRIMARY KEY ("q_id","s_id")
);

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_q_id_s_id_fkey" FOREIGN KEY ("q_id", "s_id") REFERENCES "QuizList"("q_id", "s_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "SetQuiz"("m_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizList" ADD CONSTRAINT "QuizList_q_id_fkey" FOREIGN KEY ("q_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizList" ADD CONSTRAINT "QuizList_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "SetQuiz"("m_id") ON DELETE CASCADE ON UPDATE CASCADE;
