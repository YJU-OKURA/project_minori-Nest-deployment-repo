/*
  Warnings:

  - You are about to drop the column `f_id` on the `Refer` table. All the data in the column will be lost.
  - You are about to drop the column `p_id` on the `Refer` table. All the data in the column will be lost.
  - You are about to drop the `ClassUserQuiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FileFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizBank` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizFeedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SetQuiz` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fid` to the `Refer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pid` to the `Refer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_q_id_s_id_fkey";

-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_f_id_fkey";

-- DropForeignKey
ALTER TABLE "FileFeedback" DROP CONSTRAINT "FileFeedback_f_id_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_p_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_m_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_m_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizBank" DROP CONSTRAINT "QuizBank_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_s_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizList" DROP CONSTRAINT "QuizList_q_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizList" DROP CONSTRAINT "QuizList_s_id_fkey";

-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_f_id_fkey";

-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_p_id_fkey";

-- DropForeignKey
ALTER TABLE "SetQuiz" DROP CONSTRAINT "SetQuiz_m_id_fkey";

-- AlterTable
ALTER TABLE "Refer" DROP COLUMN "f_id",
DROP COLUMN "p_id",
ADD COLUMN     "fid" BIGINT NOT NULL,
ADD COLUMN     "pid" BIGINT NOT NULL;

-- DropTable
DROP TABLE "ClassUserQuiz";

-- DropTable
DROP TABLE "File";

-- DropTable
DROP TABLE "FileFeedback";

-- DropTable
DROP TABLE "Material";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Prompt";

-- DropTable
DROP TABLE "Quiz";

-- DropTable
DROP TABLE "QuizBank";

-- DropTable
DROP TABLE "QuizFeedback";

-- DropTable
DROP TABLE "QuizList";

-- DropTable
DROP TABLE "SetQuiz";

-- CreateTable
CREATE TABLE "materials" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "cid" BIGINT NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "m_path" TEXT NOT NULL,
    "v_path" TEXT NOT NULL,
    "fid" BIGINT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("fid")
);

-- CreateTable
CREATE TABLE "file_feedbacks" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "fid" BIGINT NOT NULL,
    "is_saved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "file_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" BIGSERIAL NOT NULL,
    "usage" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "mid" BIGINT NOT NULL,
    "uid" BIGINT NOT NULL,
    "cid" BIGINT NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_save" BOOLEAN NOT NULL DEFAULT false,
    "pid" BIGINT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" BIGSERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mid" BIGINT NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_user_quizzes" (
    "result" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uid" BIGINT NOT NULL,
    "cid" BIGINT NOT NULL,
    "qid" BIGINT NOT NULL,
    "sid" BIGINT NOT NULL,

    CONSTRAINT "class_user_quizzes_pkey" PRIMARY KEY ("uid","cid","qid","sid")
);

-- CreateTable
CREATE TABLE "set_quizzes" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "mid" BIGINT NOT NULL,

    CONSTRAINT "set_quizzes_pkey" PRIMARY KEY ("mid")
);

-- CreateTable
CREATE TABLE "quiz_feedbacks" (
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uid" BIGINT NOT NULL,
    "cid" BIGINT NOT NULL,
    "sid" BIGINT NOT NULL,

    CONSTRAINT "quiz_feedbacks_pkey" PRIMARY KEY ("uid","cid","sid")
);

-- CreateTable
CREATE TABLE "quiz_lists" (
    "qid" BIGINT NOT NULL,
    "sid" BIGINT NOT NULL,

    CONSTRAINT "quiz_lists_pkey" PRIMARY KEY ("qid","sid")
);

-- CreateTable
CREATE TABLE "quiz_banks" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "uid" BIGINT NOT NULL,
    "cid" BIGINT NOT NULL,

    CONSTRAINT "quiz_banks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_cid_fkey" FOREIGN KEY ("cid") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_fid_fkey" FOREIGN KEY ("fid") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_fid_fkey" FOREIGN KEY ("fid") REFERENCES "files"("fid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_pid_fkey" FOREIGN KEY ("pid") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file_feedbacks" ADD CONSTRAINT "file_feedbacks_fid_fkey" FOREIGN KEY ("fid") REFERENCES "files"("fid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_mid_fkey" FOREIGN KEY ("mid") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_pid_fkey" FOREIGN KEY ("pid") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_mid_fkey" FOREIGN KEY ("mid") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_user_quizzes" ADD CONSTRAINT "class_user_quizzes_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_user_quizzes" ADD CONSTRAINT "class_user_quizzes_qid_sid_fkey" FOREIGN KEY ("qid", "sid") REFERENCES "quiz_lists"("qid", "sid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "set_quizzes" ADD CONSTRAINT "set_quizzes_mid_fkey" FOREIGN KEY ("mid") REFERENCES "materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_feedbacks" ADD CONSTRAINT "quiz_feedbacks_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_feedbacks" ADD CONSTRAINT "quiz_feedbacks_sid_fkey" FOREIGN KEY ("sid") REFERENCES "set_quizzes"("mid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lists" ADD CONSTRAINT "quiz_lists_qid_fkey" FOREIGN KEY ("qid") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lists" ADD CONSTRAINT "quiz_lists_sid_fkey" FOREIGN KEY ("sid") REFERENCES "set_quizzes"("mid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_banks" ADD CONSTRAINT "quiz_banks_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;
