/*
  Warnings:

  - The primary key for the `Class_user_quiz` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `s_id` to the `Class_user_quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Class_user_quiz" DROP CONSTRAINT "Class_user_quiz_pkey",
ADD COLUMN     "s_id" BIGINT NOT NULL,
ADD CONSTRAINT "Class_user_quiz_pkey" PRIMARY KEY ("u_id", "c_id", "q_id", "s_id");

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "SetQuiz" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "SetQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizFeedback" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "s_id" BIGINT NOT NULL,

    CONSTRAINT "QuizFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Class_user_quiz" ADD CONSTRAINT "Class_user_quiz_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "SetQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetQuiz" ADD CONSTRAINT "SetQuiz_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_user"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "SetQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
