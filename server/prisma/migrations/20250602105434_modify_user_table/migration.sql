-- CreateEnum
CREATE TYPE "UserProvider" AS ENUM ('CREDENTIALS', 'GOOGLE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "UserProvider" NOT NULL DEFAULT 'CREDENTIALS',
ALTER COLUMN "password" DROP NOT NULL;
