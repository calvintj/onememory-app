/*
  Warnings:

  - The `tag` column on the `StoryEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StoryTag" AS ENUM ('FUNNY', 'EMOTIONAL', 'AWKWARD', 'SAD', 'HAPPY', 'ANGRY', 'INSPIRING', 'BORING', 'SURPRISING');

-- AlterTable
ALTER TABLE "StoryEntry" DROP COLUMN "tag",
ADD COLUMN     "tag" "StoryTag" NOT NULL DEFAULT 'HAPPY';
