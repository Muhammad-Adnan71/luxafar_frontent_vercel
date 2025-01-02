-- AlterTable
ALTER TABLE `BespokeQuestion` ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Forms` ADD COLUMN `tourId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Forms` ADD CONSTRAINT `Forms_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tours`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
