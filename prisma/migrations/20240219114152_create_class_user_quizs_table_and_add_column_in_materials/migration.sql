-- AlterTable
ALTER TABLE "Materials" ADD COLUMN     "quiz_deadline" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Class_user_quizs" (
    "result" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,
    "q_id" BIGINT NOT NULL,

    CONSTRAINT "Class_user_quizs_pkey" PRIMARY KEY ("u_id","c_id")
);

-- AddForeignKey
ALTER TABLE "Class_user_quizs" ADD CONSTRAINT "Class_user_quizs_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "Class_users"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Class_user_quizs" ADD CONSTRAINT "Class_user_quizs_q_id_fkey" FOREIGN KEY ("q_id") REFERENCES "Quizs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
