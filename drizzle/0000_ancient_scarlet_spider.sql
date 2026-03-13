CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`url` text DEFAULT '',
	`imageSrc` text DEFAULT '',
	`description` text NOT NULL,
	`bought` integer DEFAULT false NOT NULL,
	`wishlistId` text NOT NULL,
	FOREIGN KEY (`wishlistId`) REFERENCES `Wishlist`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `Wishlist` (
	`id` text PRIMARY KEY NOT NULL,
	`public` integer DEFAULT true NOT NULL,
	`title` text NOT NULL,
	`imageSrc` text DEFAULT '',
	`slugUrlText` text NOT NULL,
	`description` text DEFAULT ''
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Wishlist_slugUrlText_unique` ON `Wishlist` (`slugUrlText`);