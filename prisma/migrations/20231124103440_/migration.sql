/*
  Warnings:

  - You are about to drop the column `destinationId` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `holidayTypeId` on the `Tours` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Tours` DROP FOREIGN KEY `Tours_destinationId_fkey`;

-- DropForeignKey
ALTER TABLE `Tours` DROP FOREIGN KEY `Tours_holidayTypeId_fkey`;

-- AlterTable
ALTER TABLE `Tours` DROP COLUMN `destinationId`,
    DROP COLUMN `holidayTypeId`;

-- CreateTable
CREATE TABLE `TourDestinations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TourHolidayType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tourId` INTEGER NOT NULL,
    `holidayTypeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TourDestinations` ADD CONSTRAINT `TourDestinations_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourDestinations` ADD CONSTRAINT `TourDestinations_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourHolidayType` ADD CONSTRAINT `TourHolidayType_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourHolidayType` ADD CONSTRAINT `TourHolidayType_holidayTypeId_fkey` FOREIGN KEY (`holidayTypeId`) REFERENCES `HolidayType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
