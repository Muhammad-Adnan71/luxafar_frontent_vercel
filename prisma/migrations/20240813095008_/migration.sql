-- AlterTable
ALTER TABLE `ExperienceCategory` ADD COLUMN `sliderMediaId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ExperienceCategory` ADD CONSTRAINT `ExperienceCategory_sliderMediaId_fkey` FOREIGN KEY (`sliderMediaId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
