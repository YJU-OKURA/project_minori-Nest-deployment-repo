/*
  Warnings:

  - You are about to drop the `class_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "feedbacks" DROP CONSTRAINT "feedbacks_m_id_fkey";

-- DropForeignKey
ALTER TABLE "materials" DROP CONSTRAINT "materials_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_p_id_fkey";

-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_m_id_fkey";

-- DropForeignKey
ALTER TABLE "prompts" DROP CONSTRAINT "prompts_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "quizs" DROP CONSTRAINT "quizs_m_id_fkey";

-- DropTable
DROP TABLE "class_users";

-- DropTable
DROP TABLE "feedbacks";

-- DropTable
DROP TABLE "materials";

-- DropTable
DROP TABLE "messages";

-- DropTable
DROP TABLE "prompts";

-- DropTable
DROP TABLE "quizs";

-- CreateTable
CREATE TABLE "Class_users" (
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Class_users_pkey" PRIMARY KEY ("u_id","c_id")
);

-- CreateTable
CREATE TABLE "Materials" (
    "id" BIGSERIAL NOT NULL,
    "m_path" TEXT NOT NULL,
    "v_path" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompts" (
    "id" BIGSERIAL NOT NULL,
    "usage" BIGINT NOT NULL,
    "m_id" BIGINT NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "Prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" BIGSERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_save" BOOLEAN NOT NULL DEFAULT false,
    "p_id" BIGINT NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quizs" (
    "id" BIGSERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "Quizs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Materials" ADD CONSTRAINT "Materials_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_users"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompts" ADD CONSTRAINT "Prompts_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompts" ADD CONSTRAINT "Prompts_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_users"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "Prompts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizs" ADD CONSTRAINT "Quizs_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
