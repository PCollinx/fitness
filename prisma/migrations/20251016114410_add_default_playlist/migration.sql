-- CreateTable
CREATE TABLE "DefaultPlaylist" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "spotifyPlaylistId" TEXT NOT NULL,
    "spotifyPlaylistUrl" TEXT NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL DEFAULT 'workout',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultPlaylist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DefaultPlaylist_spotifyPlaylistId_key" ON "DefaultPlaylist"("spotifyPlaylistId");

-- CreateIndex
CREATE INDEX "DefaultPlaylist_category_idx" ON "DefaultPlaylist"("category");

-- CreateIndex
CREATE INDEX "DefaultPlaylist_isActive_idx" ON "DefaultPlaylist"("isActive");
