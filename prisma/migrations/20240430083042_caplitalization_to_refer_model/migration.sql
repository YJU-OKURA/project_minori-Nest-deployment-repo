/*
  Warnings:

  - You are about to drop the `Refer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_fid_fkey";

-- DropForeignKey
ALTER TABLE "Refer" DROP CONSTRAINT "Refer_pid_fkey";

-- DropTable
DROP TABLE "Refer";

-- CreateTable
CREATE TABLE "refers" (
    "id" BIGSERIAL NOT NULL,
    "page" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fid" BIGINT NOT NULL,
    "pid" BIGINT NOT NULL,

    CONSTRAINT "refers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refers" ADD CONSTRAINT "refers_fid_fkey" FOREIGN KEY ("fid") REFERENCES "files"("fid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refers" ADD CONSTRAINT "refers_pid_fkey" FOREIGN KEY ("pid") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
