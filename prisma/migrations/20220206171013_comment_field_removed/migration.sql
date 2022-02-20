/*
  Warnings:

  - You are about to drop the column `comment` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "imageSrc" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "bought" BOOLEAN NOT NULL DEFAULT false,
    "wishlistId" TEXT NOT NULL,
    CONSTRAINT "Item_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("bought", "description", "id", "imageSrc", "title", "url", "wishlistId") SELECT "bought", "description", "id", "imageSrc", "title", "url", "wishlistId" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
