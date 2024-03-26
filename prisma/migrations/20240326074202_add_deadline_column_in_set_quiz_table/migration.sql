/*
  Warnings:

  - You are about to drop the column `quiz_deadline` on the `Material` table. All the data in the column will be lost.
  - Added the required column `deadline` to the `SetQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClassUserQuiz" ALTER COLUMN "result" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "quiz_deadline";

-- AlterTable
ALTER TABLE "SetQuiz" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
