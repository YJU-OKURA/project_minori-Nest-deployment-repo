-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_u_id_c_id_fkey";

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_user"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;
