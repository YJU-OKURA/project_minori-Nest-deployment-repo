/*
  Warnings:

  - You are about to drop the `Class_user_quizs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prompts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quizs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class_user_quizs" DROP CONSTRAINT "Class_user_quizs_q_id_fkey";

-- DropForeignKey
ALTER TABLE "Class_user_quizs" DROP CONSTRAINT "Class_user_quizs_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_m_id_fkey";

-- DropForeignKey
ALTER TABLE "Materials" DROP CONSTRAINT "Materials_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_p_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompts" DROP CONSTRAINT "Prompts_m_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompts" DROP CONSTRAINT "Prompts_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Quizs" DROP CONSTRAINT "Quizs_m_id_fkey";

-- DropTable
DROP TABLE "Class_user_quizs";

-- DropTable
DROP TABLE "Class_users";

-- DropTable
DROP TABLE "Feedbacks";

-- DropTable
DROP TABLE "Materials";

-- DropTable
DROP TABLE "Messages";

-- DropTable
DROP TABLE "Prompts";

-- DropTable
DROP TABLE "Quizs";

-- CreateTable
CREATE TABLE "Class_user" (
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Class_user_pkey" PRIMARY KEY ("u_id","c_id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" BIGSERIAL NOT NULL,
    "m_path" TEXT NOT NULL,
    "v_path" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "quiz_deadline" TIMESTAMP(3),
    "u_id" BIGINT,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" BIGSERIAL NOT NULL,
    "usage" BIGINT NOT NULL,
    "m_id" BIGINT NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" BIGSERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_save" BOOLEAN NOT NULL DEFAULT false,
    "p_id" BIGINT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" BIGSERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Class_user_quiz" (
    "result" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "q_id" BIGINT NOT NULL,

    CONSTRAINT "Class_user_quiz_pkey" PRIMARY KEY ("u_id","c_id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_user"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_user"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class_user_quiz" ADD CONSTRAINT "Class_user_quiz_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_user"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class_user_quiz" ADD CONSTRAINT "Class_user_quiz_q_id_fkey" FOREIGN KEY ("q_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;
