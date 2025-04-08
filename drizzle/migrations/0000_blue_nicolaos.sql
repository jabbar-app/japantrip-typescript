CREATE TABLE `destinations` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`city` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`imageUrl` varchar(255) NOT NULL,
	`visitDurationHours` float NOT NULL,
	`rating` float NOT NULL,
	`category` varchar(100) NOT NULL,
	`recommendedTime` varchar(100) NOT NULL,
	`priority` int NOT NULL,
	`isIndoor` boolean NOT NULL,
	`hasTicket` boolean NOT NULL,
	`ticketPriceYen` int NOT NULL,
	`openHour` varchar(20) NOT NULL,
	`closeHour` varchar(20) NOT NULL,
	`link_gmaps` varchar(255) NOT NULL,
	`suitableForKids` boolean NOT NULL,
	`estimatedWalkMinutesFromPrevious` int NOT NULL,
	CONSTRAINT `destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itineraries` (
	`id` varchar(36) NOT NULL,
	`userId` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`days` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `itineraries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_days` (
	`id` varchar(36) NOT NULL,
	`dayNumber` int NOT NULL,
	`itineraryId` varchar(36) NOT NULL,
	CONSTRAINT `itinerary_days_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `itinerary_destinations` (
	`id` varchar(36) NOT NULL,
	`itineraryDayId` varchar(36) NOT NULL,
	`destinationId` varchar(36) NOT NULL,
	`order` int NOT NULL,
	`recommendedVisitTime` varchar(100) NOT NULL,
	CONSTRAINT `itinerary_destinations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL,
	`password` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
