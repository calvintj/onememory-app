-- DropForeignKey
ALTER TABLE "MemoryEntry" DROP CONSTRAINT "MemoryEntry_userId_fkey";

-- AddForeignKey
ALTER TABLE "MemoryEntry" ADD CONSTRAINT "MemoryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
