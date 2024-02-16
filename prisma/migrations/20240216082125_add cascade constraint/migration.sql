-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_m_id_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_p_id_fkey";

-- DropForeignKey
ALTER TABLE "Prompts" DROP CONSTRAINT "Prompts_m_id_fkey";

-- DropForeignKey
ALTER TABLE "Quizs" DROP CONSTRAINT "Quizs_m_id_fkey";

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompts" ADD CONSTRAINT "Prompts_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_p_id_fkey" FOREIGN KEY ("p_id") REFERENCES "Prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quizs" ADD CONSTRAINT "Quizs_m_id_fkey" FOREIGN KEY ("m_id") REFERENCES "Materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
