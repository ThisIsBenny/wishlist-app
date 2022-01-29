-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "slugUrlText" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "comment" TEXT,
    "bought" BOOLEAN NOT NULL DEFAULT false,
    "wishlistId" TEXT,
    CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_slugUrlText_key" ON "Wishlist"("slugUrlText");
