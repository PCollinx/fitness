/*
  Warnings:

  - You are about to drop the column `createdBy` on the `DefaultPlaylist` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `DefaultPlaylist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DefaultPlaylist" DROP COLUMN "createdBy",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "DefaultPlaylist_createdById_idx" ON "DefaultPlaylist"("createdById");

-- AddForeignKey
ALTER TABLE "DefaultPlaylist" ADD CONSTRAINT "DefaultPlaylist_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
