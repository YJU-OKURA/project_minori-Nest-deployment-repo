/*
  Warnings:

  - You are about to drop the `Class_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Class_user_quiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Class_user_quiz" DROP CONSTRAINT "Class_user_quiz_q_id_fkey";

-- DropForeignKey
ALTER TABLE "Class_user_quiz" DROP CONSTRAINT "Class_user_quiz_s_id_fkey";

-- DropForeignKey
ALTER TABLE "Class_user_quiz" DROP CONSTRAINT "Class_user_quiz_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_u_id_c_id_fkey";

-- DropForeignKey
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_u_id_c_id_fkey";

-- DropTable
DROP TABLE "Class_user";

-- DropTable
DROP TABLE "Class_user_quiz";

-- CreateTable
CREATE TABLE "ClassUser" (
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "ClassUser_pkey" PRIMARY KEY ("u_id","c_id")
);

-- CreateTable
CREATE TABLE "ClassUserQuiz" (
    "result" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "q_id" BIGINT NOT NULL,
    "s_id" BIGINT NOT NULL,

    CONSTRAINT "ClassUserQuiz_pkey" PRIMARY KEY ("u_id","c_id","q_id","s_id")
);

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "ClassUser"("u_id", "c_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "ClassUser"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "ClassUser"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_q_id_fkey" FOREIGN KEY ("q_id") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassUserQuiz" ADD CONSTRAINT "ClassUserQuiz_s_id_fkey" FOREIGN KEY ("s_id") REFERENCES "SetQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizFeedback" ADD CONSTRAINT "QuizFeedback_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "ClassUser"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;
