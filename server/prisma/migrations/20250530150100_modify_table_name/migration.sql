/*
  Warnings:

  - You are about to drop the `StoryEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MemoryTag" AS ENUM ('FUNNY', 'EMOTIONAL', 'AWKWARD', 'SAD', 'HAPPY', 'ANGRY', 'INSPIRING', 'BORING', 'SURPRISING');

-- DropForeignKey
ALTER TABLE "StoryEntry" DROP CONSTRAINT "StoryEntry_userId_fkey";

-- DropTable
DROP TABLE "StoryEntry";

-- DropEnum
DROP TYPE "StoryTag";

-- CreateTable
CREATE TABLE "MemoryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "tag" "MemoryTag" NOT NULL DEFAULT 'HAPPY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemoryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemoryEntry_userId_date_key" ON "MemoryEntry"("userId", "date");

-- AddForeignKey
ALTER TABLE "MemoryEntry" ADD CONSTRAINT "MemoryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
