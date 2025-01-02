-- DropForeignKey
ALTER TABLE `DestinationFeatureOffered` DROP FOREIGN KEY `DestinationFeatureOffered_destinationFeatureId_fkey`;

-- DropForeignKey
ALTER TABLE `DestinationFeatureOffered` DROP FOREIGN KEY `DestinationFeatureOffered_destinationId_fkey`;

-- AddForeignKey
ALTER TABLE `DestinationFeatureOffered` ADD CONSTRAINT `DestinationFeatureOffered_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeatureOffered` ADD CONSTRAINT `DestinationFeatureOffered_destinationFeatureId_fkey` FOREIGN KEY (`destinationFeatureId`) REFERENCES `DestinationFeatures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
