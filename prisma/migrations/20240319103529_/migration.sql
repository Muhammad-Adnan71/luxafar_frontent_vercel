-- AlterTable
ALTER TABLE `Attraction` ADD COLUMN `attractionId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `DayToDayItinerary` ADD COLUMN `dayToDayId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `DestinationFeatureOffered` ADD COLUMN `destinationFeatureOfferedId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `DestinationFeatures` ADD COLUMN `featureId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Destinations` ADD COLUMN `destinaitonId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Highlights` ADD COLUMN `highlightId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `HolidayType` ADD COLUMN `holidayId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `PlaceToVisit` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `planId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PlanService` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `planId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PrivatePlan` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `privatePlanId` INTEGER NULL;

-- AlterTable
ALTER TABLE `SeasonToVisit` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `seasonId` INTEGER NULL;

-- AlterTable
ALTER TABLE `SupplementPolicy` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `supplementId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ThingsToDo` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `thingId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tours` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `tourId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Destinations` ADD CONSTRAINT `Destinations_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeatures` ADD CONSTRAINT `DestinationFeatures_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeatureOffered` ADD CONSTRAINT `DestinationFeatureOffered_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HolidayType` ADD CONSTRAINT `HolidayType_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Highlights` ADD CONSTRAINT `Highlights_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceToVisit` ADD CONSTRAINT `PlaceToVisit_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attraction` ADD CONSTRAINT `Attraction_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeasonToVisit` ADD CONSTRAINT `SeasonToVisit_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThingsToDo` ADD CONSTRAINT `ThingsToDo_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanService` ADD CONSTRAINT `PlanService_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tours` ADD CONSTRAINT `Tours_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DayToDayItinerary` ADD CONSTRAINT `DayToDayItinerary_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PrivatePlan` ADD CONSTRAINT `PrivatePlan_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplementPolicy` ADD CONSTRAINT `SupplementPolicy_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
