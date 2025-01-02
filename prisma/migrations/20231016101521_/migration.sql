-- DropForeignKey
ALTER TABLE `ToursToPlanService` DROP FOREIGN KEY `ToursToPlanService_planeServiceId_fkey`;

-- DropForeignKey
ALTER TABLE `ToursToPlanService` DROP FOREIGN KEY `ToursToPlanService_tourId_fkey`;

-- AlterTable
ALTER TABLE `Content` ADD COLUMN `sortId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ToursToPlanService` ADD CONSTRAINT `ToursToPlanService_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ToursToPlanService` ADD CONSTRAINT `ToursToPlanService_planeServiceId_fkey` FOREIGN KEY (`planeServiceId`) REFERENCES `PlanService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
