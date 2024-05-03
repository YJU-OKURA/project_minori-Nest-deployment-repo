-- AlterTable
ALTER TABLE "class_boards" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "is_announced" DROP NOT NULL;

-- AlterTable
ALTER TABLE "class_users" ALTER COLUMN "is_favorite" DROP NOT NULL,
ALTER COLUMN "is_favorite" DROP DEFAULT;

-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "description" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "limitation" INTEGER;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "p_id" DROP NOT NULL,
ALTER COLUMN "p_id" SET DATA TYPE TEXT;
