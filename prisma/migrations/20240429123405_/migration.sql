/*
  Warnings:

  - A unique constraint covering the columns `[caughtAllRouteId]` on the table `Destinations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caughtAllRouteId]` on the table `Inspirations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caughtAllRouteId]` on the table `PlaceToVisit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[caughtAllRouteId]` on the table `Tours` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Destinations` ADD COLUMN `caughtAllRouteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Inspirations` ADD COLUMN `caughtAllRouteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PlaceToVisit` ADD COLUMN `caughtAllRouteId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tours` ADD COLUMN `caughtAllRouteId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CaughtAllRoutes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `route` VARCHAR(191) NOT NULL,
    `layout` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CaughtAllRoutes_route_key`(`route`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Destinations_caughtAllRouteId_key` ON `Destinations`(`caughtAllRouteId`);

-- CreateIndex
CREATE UNIQUE INDEX `Inspirations_caughtAllRouteId_key` ON `Inspirations`(`caughtAllRouteId`);

-- CreateIndex
CREATE UNIQUE INDEX `PlaceToVisit_caughtAllRouteId_key` ON `PlaceToVisit`(`caughtAllRouteId`);

-- CreateIndex
CREATE UNIQUE INDEX `Tours_caughtAllRouteId_key` ON `Tours`(`caughtAllRouteId`);

-- AddForeignKey
ALTER TABLE `Destinations` ADD CONSTRAINT `Destinations_caughtAllRouteId_fkey` FOREIGN KEY (`caughtAllRouteId`) REFERENCES `CaughtAllRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inspirations` ADD CONSTRAINT `Inspirations_caughtAllRouteId_fkey` FOREIGN KEY (`caughtAllRouteId`) REFERENCES `CaughtAllRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceToVisit` ADD CONSTRAINT `PlaceToVisit_caughtAllRouteId_fkey` FOREIGN KEY (`caughtAllRouteId`) REFERENCES `CaughtAllRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tours` ADD CONSTRAINT `Tours_caughtAllRouteId_fkey` FOREIGN KEY (`caughtAllRouteId`) REFERENCES `CaughtAllRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
