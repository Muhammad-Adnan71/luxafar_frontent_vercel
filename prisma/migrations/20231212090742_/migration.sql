/*
  Warnings:

  - A unique constraint covering the columns `[seoMetaId]` on the table `Destinations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seoMetaId]` on the table `HolidayType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seoMetaId]` on the table `PlaceToVisit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[seoMetaId]` on the table `Tours` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Inspirations` DROP FOREIGN KEY `Inspirations_destinationId_fkey`;

-- DropForeignKey
ALTER TABLE `Inspirations` DROP FOREIGN KEY `Inspirations_holidayTypeId_fkey`;

-- AlterTable
ALTER TABLE `Destinations` ADD COLUMN `seoMetaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `HolidayType` ADD COLUMN `seoMetaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PlaceToVisit` ADD COLUMN `seoMetaId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tours` ADD COLUMN `seoMetaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `_DestinationsToInspirations` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DestinationsToInspirations_AB_unique`(`A`, `B`),
    INDEX `_DestinationsToInspirations_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_HolidayTypeToInspirations` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_HolidayTypeToInspirations_AB_unique`(`A`, `B`),
    INDEX `_HolidayTypeToInspirations_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Destinations_seoMetaId_key` ON `Destinations`(`seoMetaId`);

-- CreateIndex
CREATE UNIQUE INDEX `HolidayType_seoMetaId_key` ON `HolidayType`(`seoMetaId`);

-- CreateIndex
CREATE UNIQUE INDEX `PlaceToVisit_seoMetaId_key` ON `PlaceToVisit`(`seoMetaId`);

-- CreateIndex
CREATE UNIQUE INDEX `Tours_seoMetaId_key` ON `Tours`(`seoMetaId`);

-- AddForeignKey
ALTER TABLE `Destinations` ADD CONSTRAINT `Destinations_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HolidayType` ADD CONSTRAINT `HolidayType_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceToVisit` ADD CONSTRAINT `PlaceToVisit_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tours` ADD CONSTRAINT `Tours_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DestinationsToInspirations` ADD CONSTRAINT `_DestinationsToInspirations_A_fkey` FOREIGN KEY (`A`) REFERENCES `Destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DestinationsToInspirations` ADD CONSTRAINT `_DestinationsToInspirations_B_fkey` FOREIGN KEY (`B`) REFERENCES `Inspirations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HolidayTypeToInspirations` ADD CONSTRAINT `_HolidayTypeToInspirations_A_fkey` FOREIGN KEY (`A`) REFERENCES `HolidayType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_HolidayTypeToInspirations` ADD CONSTRAINT `_HolidayTypeToInspirations_B_fkey` FOREIGN KEY (`B`) REFERENCES `Inspirations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
