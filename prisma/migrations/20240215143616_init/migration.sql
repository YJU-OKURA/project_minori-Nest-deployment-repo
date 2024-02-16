-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'ASSISTANT', 'APPLICANT', 'BLACKLIST');

-- CreateTable
CREATE TABLE "class_users" (
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "class_users_pkey" PRIMARY KEY ("u_id","c_id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" BIGSERIAL NOT NULL,
    "m_path" TEXT NOT NULL,
    "v_path" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" BIGSERIAL NOT NULL,
    "usage" BIGINT NOT NULL,
    "m_id" BIGINT NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" BIGSERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_save" BOOLEAN NOT NULL DEFAULT false,
    "p_id" BIGINT NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizs" (
    "id" BIGSERIAL NOT NULL,
    "content" JSONB NOT NULL,
    "m_id" BIGINT NOT NULL,

    CONSTRAINT "quizs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "materials" ADD CONSTRAINT "materials_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "prompts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizs" ADD CONSTRAINT "quizs_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
