/*
  Warnings:

  - You are about to drop the column `m_path` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `v_path` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "m_path",
DROP COLUMN "v_path";

-- CreateTable
CREATE TABLE "File" (
    "m_path" TEXT NOT NULL,
    "v_path" TEXT NOT NULL,
    "f_id" BIGINT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("f_id")
);

-- CreateTable
CREATE TABLE "Refer" (
    "id" BIGSERIAL NOT NULL,
    "refered_Page" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "f_id" BIGINT NOT NULL,
    "p_id" BIGINT NOT NULL,

    CONSTRAINT "Refer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileFeedback" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "f_id" BIGINT NOT NULL,

    CONSTRAINT "FileFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_f_id_fkey" FOREIGN KEY ("f_id") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_f_id_fkey" FOREIGN KEY ("f_id") REFERENCES "File"("f_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refer" ADD CONSTRAINT "Refer_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileFeedback" ADD CONSTRAINT "FileFeedback_f_id_fkey" FOREIGN KEY ("f_id") REFERENCES "File"("f_id") ON DELETE CASCADE ON UPDATE CASCADE;
