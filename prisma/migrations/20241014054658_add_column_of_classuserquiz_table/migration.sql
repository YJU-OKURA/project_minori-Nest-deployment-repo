/*
  Warnings:

  - Added the required column `answer` to the `class_user_quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Answer" AS ENUM ('a', 'b', 'c', 'd');

-- AlterTable
ALTER TABLE "class_user_quizzes" ADD COLUMN     "answer" "Answer" NOT NULL;
