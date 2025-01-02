/*
  Warnings:

  - You are about to drop the column `mainSectionDescription` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `placeName` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `sliderMediaId` on the `ExperienceCategory` table. All the data in the column will be lost.
  - You are about to drop the column `mainSectionDescription` on the `ExperienceTranslation` table. All the data in the column will be lost.
  - You are about to drop the column `placeName` on the `ExperienceTranslation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[journeyVideoId]` on the table `Experience` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[experienceBannerVideoMediaId]` on the table `Experience` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `experienceBannerVideoMediaId` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `galleryHeading` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `journeyVideoId` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subTitle` to the `Experience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `galleryHeading` to the `ExperienceTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ExperienceCategory` DROP FOREIGN KEY `ExperienceCategory_sliderMediaId_fkey`;

-- AlterTable
ALTER TABLE `Experience` DROP COLUMN `mainSectionDescription`,
    DROP COLUMN `placeName`,
    ADD COLUMN `experienceBannerVideoMediaId` INTEGER NOT NULL,
    ADD COLUMN `galleryHeading` VARCHAR(191) NOT NULL,
    ADD COLUMN `journeyDescription` LONGTEXT NULL,
    ADD COLUMN `journeyHeading` VARCHAR(191) NULL,
    ADD COLUMN `journeyTitle` VARCHAR(191) NULL,
    ADD COLUMN `journeyVideoId` INTEGER NOT NULL,
    ADD COLUMN `price` INTEGER NULL,
    ADD COLUMN `subTitle` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `ExperienceCategory` DROP COLUMN `sliderMediaId`,
    ADD COLUMN `experienceCategoryVideoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ExperienceTranslation` DROP COLUMN `mainSectionDescription`,
    DROP COLUMN `placeName`,
    ADD COLUMN `galleryHeading` VARCHAR(191) NOT NULL,
    ADD COLUMN `journeyDescription` LONGTEXT NULL,
    ADD COLUMN `journeyHeading` VARCHAR(191) NULL,
    ADD COLUMN `journeyTitle` VARCHAR(191) NULL,
    ADD COLUMN `subTitle` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ExperienceFeatures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `imageId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExperienceFeatures_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceFeaturesTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `ExperienceFeaturesId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `langId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceGallery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageId` INTEGER NULL,
    `ExperienceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExperienceGallery_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ExperienceToExperienceFeatures` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ExperienceToExperienceFeatures_AB_unique`(`A`, `B`),
    INDEX `_ExperienceToExperienceFeatures_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Experience_journeyVideoId_key` ON `Experience`(`journeyVideoId`);

-- CreateIndex
CREATE UNIQUE INDEX `Experience_experienceBannerVideoMediaId_key` ON `Experience`(`experienceBannerVideoMediaId`);

-- AddForeignKey
ALTER TABLE `ExperienceCategory` ADD CONSTRAINT `ExperienceCategory_experienceCategoryVideoId_fkey` FOREIGN KEY (`experienceCategoryVideoId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_journeyVideoId_fkey` FOREIGN KEY (`journeyVideoId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_experienceBannerVideoMediaId_fkey` FOREIGN KEY (`experienceBannerVideoMediaId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceFeatures` ADD CONSTRAINT `ExperienceFeatures_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceFeaturesTranslation` ADD CONSTRAINT `ExperienceFeaturesTranslation_ExperienceFeaturesId_fkey` FOREIGN KEY (`ExperienceFeaturesId`) REFERENCES `ExperienceFeatures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceFeaturesTranslation` ADD CONSTRAINT `ExperienceFeaturesTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceGallery` ADD CONSTRAINT `ExperienceGallery_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceGallery` ADD CONSTRAINT `ExperienceGallery_ExperienceId_fkey` FOREIGN KEY (`ExperienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToExperienceFeatures` ADD CONSTRAINT `_ExperienceToExperienceFeatures_A_fkey` FOREIGN KEY (`A`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ExperienceToExperienceFeatures` ADD CONSTRAINT `_ExperienceToExperienceFeatures_B_fkey` FOREIGN KEY (`B`) REFERENCES `ExperienceFeatures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
