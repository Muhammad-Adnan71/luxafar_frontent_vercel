-- DropForeignKey
ALTER TABLE `Gallery` DROP FOREIGN KEY `Gallery_imageId_fkey`;

-- AlterTable
ALTER TABLE `Banner` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Faqs` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Gallery` MODIFY `imageId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Gallery` ADD CONSTRAINT `Gallery_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
