CREATE TABLE `data` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`data` text NOT NULL,
	`access_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `data_id_unique` ON `data` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uid` ON `data` (`id`);