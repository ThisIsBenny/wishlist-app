-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wishlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "public" BOOLEAN NOT NULL DEFAULT true,
    "title" TEXT NOT NULL,
    "imageSrc" TEXT NOT NULL,
    "slugUrlText" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Wishlist" ("description", "id", "imageSrc", "slugUrlText", "title") SELECT "description", "id", "imageSrc", "slugUrlText", "title" FROM "Wishlist";
DROP TABLE "Wishlist";
ALTER TABLE "new_Wishlist" RENAME TO "Wishlist";
CREATE UNIQUE INDEX "Wishlist_slugUrlText_key" ON "Wishlist"("slugUrlText");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
