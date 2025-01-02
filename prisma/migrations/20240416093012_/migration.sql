-- AlterTable
ALTER TABLE `Testimonial` ADD COLUMN `destinationId` INTEGER NULL,
    ADD COLUMN `destinationSortId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destinations`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
