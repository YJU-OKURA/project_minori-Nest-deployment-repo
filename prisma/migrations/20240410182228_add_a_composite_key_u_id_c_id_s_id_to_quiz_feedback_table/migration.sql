/*
  Warnings:

  - The primary key for the `QuizFeedback` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `QuizFeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuizFeedback" DROP CONSTRAINT "QuizFeedback_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "QuizFeedback_pkey" PRIMARY KEY ("u_id", "c_id", "s_id");
