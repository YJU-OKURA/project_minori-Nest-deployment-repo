/*
  Warnings:

  - The primary key for the `class_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `c_id` on the `class_users` table. All the data in the column will be lost.
  - You are about to drop the column `u_id` on the `class_users` table. All the data in the column will be lost.
  - Added the required column `cid` to the `class_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `class_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizBank" DROP CONSTRAINT "QuizBank_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_uid_cid_fkey";

-- DropForeignKey
ALTER TABLE "class_boards" DROP CONSTRAINT "class_boards_uid_cid_fkey";

-- DropForeignKey
ALTER TABLE "class_codes" DROP CONSTRAINT "class_codes_uid_cid_fkey";

-- DropForeignKey
ALTER TABLE "class_users" DROP CONSTRAINT "class_users_c_id_fkey";

-- DropForeignKey
ALTER TABLE "class_users" DROP CONSTRAINT "class_users_u_id_fkey";

-- AlterTable
ALTER TABLE "class_users" DROP CONSTRAINT "class_users_pkey",
DROP COLUMN "c_id",
DROP COLUMN "u_id",
ADD COLUMN     "cid" BIGINT NOT NULL,
ADD COLUMN     "uid" BIGINT NOT NULL,
ADD CONSTRAINT "class_users_pkey" PRIMARY KEY ("uid", "cid");

-- AddForeignKey
ALTER TABLE "class_users" ADD CONSTRAINT "class_users_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_users" ADD CONSTRAINT "class_users_cid_fkey" FOREIGN KEY ("cid") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizBank" ADD CONSTRAINT "QuizBank_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_codes" ADD CONSTRAINT "class_codes_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_boards" ADD CONSTRAINT "class_boards_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_uid_cid_fkey" FOREIGN KEY ("uid", "cid") REFERENCES "class_users"("uid", "cid") ON DELETE CASCADE ON UPDATE CASCADE;
