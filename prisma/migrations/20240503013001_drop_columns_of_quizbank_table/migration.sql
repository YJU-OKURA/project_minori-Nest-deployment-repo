/*
  Warnings:

  - You are about to drop the column `cid` on the `quiz_banks` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "quiz_banks" DROP CONSTRAINT "quiz_banks_uid_cid_fkey";

-- AlterTable
ALTER TABLE "quiz_banks" DROP COLUMN "cid";

-- AddForeignKey
ALTER TABLE "quiz_banks" ADD CONSTRAINT "quiz_banks_uid_fkey" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
