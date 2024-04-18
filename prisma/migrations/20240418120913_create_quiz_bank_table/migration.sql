-- CreateTable
CREATE TABLE "QuizBank" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "u_id" BIGINT NOT NULL,
    "c_id" BIGINT NOT NULL,

    CONSTRAINT "QuizBank_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizBank" ADD CONSTRAINT "QuizBank_u_id_c_id_fkey" FOREIGN KEY ("u_id", "c_id") REFERENCES "ClassUser"("u_id", "c_id") ON DELETE CASCADE ON UPDATE CASCADE;
