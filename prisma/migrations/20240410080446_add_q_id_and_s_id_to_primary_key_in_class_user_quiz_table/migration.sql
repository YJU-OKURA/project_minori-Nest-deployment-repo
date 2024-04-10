/*
  Warnings:

  - The primary key for the `ClassUserQuiz` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ClassUserQuiz" DROP CONSTRAINT "ClassUserQuiz_pkey",
ADD CONSTRAINT "ClassUserQuiz_pkey" PRIMARY KEY ("u_id", "c_id", "q_id", "s_id");
