-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "slugUrlText" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "imageSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "bought" BOOLEAN NOT NULL DEFAULT false,
    "wishlistId" TEXT NOT NULL,
    CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_slugUrlText_key" ON "Wishlist"("slugUrlText");
