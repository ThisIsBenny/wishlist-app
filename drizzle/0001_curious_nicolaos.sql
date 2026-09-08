CREATE TABLE IF NOT EXISTS `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`passwordHash` text,
	`oidcIssuer` text,
	`oidcSubject` text,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `oidc_issuer_subject_idx` ON `users` (`oidcIssuer`,`oidcSubject`);--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`tokenJti` text NOT NULL,
	`expiresAt` text NOT NULL,
	`createdAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `sessions_tokenJti_unique` ON `sessions` (`tokenJti`);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `sessions_user_id_idx` ON `sessions` (`userId`);--> statement-breakpoint
-- Rebuild `Wishlist`/`items`: SQLite cannot ALTER ADD COLUMN NOT NULL without
-- DEFAULT on tables with rows (sqlite.org/lang_altertable.html step 12).
CREATE TEMP TABLE _wishlist_backup AS SELECT * FROM `Wishlist`;--> statement-breakpoint
CREATE TEMP TABLE _items_backup AS SELECT * FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
DROP TABLE `Wishlist`;--> statement-breakpoint
CREATE TABLE `Wishlist` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`public` integer DEFAULT true NOT NULL,
	`title` text NOT NULL,
	`imageSrc` text DEFAULT '',
	`slugUrlText` text NOT NULL,
	`description` text DEFAULT '',
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `Wishlist_slugUrlText_unique` ON `Wishlist` (`slugUrlText`);--> statement-breakpoint
CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text DEFAULT '',
	`imageSrc` text DEFAULT '',
	`description` text NOT NULL,
	`bought` integer DEFAULT false NOT NULL,
	`wishlistId` text NOT NULL,
	`createdAt` text NOT NULL,
	`updatedAt` text NOT NULL,
	FOREIGN KEY (`wishlistId`) REFERENCES `Wishlist`(`id`) ON UPDATE no action ON DELETE cascade
);--> statement-breakpoint
-- Bootstrap owner adopts all pre-existing wishlists (passwordHash NULL = no
-- password login for the placeholder). This migration was NEVER released
-- (file was untracked during development; git log --all is empty), so no
-- deployed database ever ran an earlier variant of it — rewriting it in
-- place is safe. Reassign adopted wishlists to a real account after first
-- login with:
--   UPDATE Wishlist SET userId = '<new-user-id>'
--   WHERE userId = '00000000-0000-4000-8000-000000000000';
INSERT INTO `users` (`id`, `email`, `passwordHash`, `oidcIssuer`, `oidcSubject`, `createdAt`, `updatedAt`)
VALUES (
	'00000000-0000-4000-8000-000000000000',
	'migrated@localhost',
	NULL,
	NULL,
	NULL,
	strftime('%Y-%m-%dT%H:%M:%fZ','now'),
	strftime('%Y-%m-%dT%H:%M:%fZ','now')
)
ON CONFLICT(`id`) DO NOTHING;--> statement-breakpoint
INSERT INTO `Wishlist` (`id`, `userId`, `public`, `title`, `imageSrc`, `slugUrlText`, `description`, `createdAt`, `updatedAt`)
SELECT
	b.id,
	'00000000-0000-4000-8000-000000000000',
	b."public",
	b.title,
	b.imageSrc,
	b.slugUrlText,
	b.description,
	strftime('%Y-%m-%dT%H:%M:%fZ','now'),
	strftime('%Y-%m-%dT%H:%M:%fZ','now')
FROM _wishlist_backup b;--> statement-breakpoint
INSERT INTO `items` (`id`, `title`, `url`, `imageSrc`, `description`, `bought`, `wishlistId`, `createdAt`, `updatedAt`)
SELECT
	b.id,
	b.title,
	b.url,
	b.imageSrc,
	b.description,
	b.bought,
	b.wishlistId,
	strftime('%Y-%m-%dT%H:%M:%fZ','now'),
	strftime('%Y-%m-%dT%H:%M:%fZ','now')
FROM _items_backup b;--> statement-breakpoint
DROP TABLE _wishlist_backup;--> statement-breakpoint
DROP TABLE _items_backup;