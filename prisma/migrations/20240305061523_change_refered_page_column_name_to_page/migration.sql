/*
  Warnings:

  - You are about to drop the column `refered_Page` on the `Refer` table. All the data in the column will be lost.
  - Added the required column `page` to the `Refer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Refer" DROP COLUMN "refered_Page",
ADD COLUMN     "page" INTEGER NOT NULL;
