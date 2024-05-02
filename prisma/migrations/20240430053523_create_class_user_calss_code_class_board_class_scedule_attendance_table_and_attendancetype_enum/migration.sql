/*
  Warnings:

  - You are about to drop the column `u_id` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the `ClassUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AttendanceType" AS ENUM ('ATTENDANCE', 'TARDY', 'ABSENCE');

-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizBank" DROP CONSTRAINT "QuizBank_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_u_id_c_id_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "u_id";

-- DropTable
DROP TABLE "ClassUser";

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
CREATE TABLE "classes" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "uid" BIGINT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "p_id" BIGINT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_codes" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "secret" TEXT,
    "cid" BIGINT NOT NULL,
    "uid" BIGINT NOT NULL,

    CONSTRAINT "class_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_boards" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_announced" BOOLEAN NOT NULL DEFAULT false,
    "cid" BIGINT NOT NULL,
    "uid" BIGINT NOT NULL,

    CONSTRAINT "class_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_schedules" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "ended_at" TIMESTAMP(3) NOT NULL,
    "is_live" BOOLEAN NOT NULL DEFAULT false,
    "cid" BIGINT NOT NULL,

    CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" BIGSERIAL NOT NULL,
    "is_attendance" "AttendanceType" NOT NULL DEFAULT 'ABSENCE',
    "uid" BIGINT NOT NULL,
    "cid" BIGINT NOT NULL,
    "csid" BIGINT NOT NULL,

    CONSTRAINT "attendances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_codes_code_key" ON "class_codes"("code");

-- AddForeignKey
ALTER TABLE "class_users" ADD CONSTRAINT "class_users_u_id_fkey" FOREIGN KEY ("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_users" ADD CONSTRAINT "class_users_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_c_id_fkey" FOREIGN KEY ("c_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizBank" ADD CONSTRAINT "QuizBank_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_codes" ADD CONSTRAINT "class_codes_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_boards" ADD CONSTRAINT "class_boards_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_schedules" ADD CONSTRAINT "class_schedules_cid_fkey" FOREIGN KEY ("cid") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_csid_fkey" FOREIGN KEY ("csid") REFERENCES "class_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
