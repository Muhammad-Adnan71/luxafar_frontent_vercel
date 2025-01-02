/*
  Warnings:

  - Made the column `imageId` on table `InspirationDetail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Languages` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Banner` DROP FOREIGN KEY `Banner_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `InspirationDetail` DROP FOREIGN KEY `InspirationDetail_imageId_fkey`;

-- AlterTable
ALTER TABLE `Banner` ADD COLUMN `bannerId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `BespokeQuestion` ADD COLUMN `bespokeQuestionId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `BespokeQuestionOptions` ADD COLUMN `BespokeQuestionOptionId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Content` MODIFY `contentId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Faqs` ADD COLUMN `faqId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `InspirationDetail` ADD COLUMN `inspirationDetailId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `imageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Inspirations` ADD COLUMN `inspirationId` INTEGER NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Languages` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Testimonial` ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `testimonialId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Inspirations` ADD CONSTRAINT `Inspirations_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationDetail` ADD CONSTRAINT `InspirationDetail_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationDetail` ADD CONSTRAINT `InspirationDetail_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Testimonial` ADD CONSTRAINT `Testimonial_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Faqs` ADD CONSTRAINT `Faqs_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestion` ADD CONSTRAINT `BespokeQuestion_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestionOptions` ADD CONSTRAINT `BespokeQuestionOptions_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
