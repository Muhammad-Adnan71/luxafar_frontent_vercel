-- AlterTable
ALTER TABLE `BespokeForm` ADD COLUMN `other` VARCHAR(191) NULL,
    ADD COLUMN `referralName` VARCHAR(191) NULL,
    ADD COLUMN `social` VARCHAR(191) NULL,
    ADD COLUMN `travelingEndDate` DATETIME(3) NULL,
    ADD COLUMN `travelingStartDate` DATETIME(3) NULL,
    ADD COLUMN `whereDidYouHear` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `ExperienceCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `mainSectionHeading` VARCHAR(191) NULL,
    `mainSectionDescription` LONGTEXT NULL,
    `imageId` INTEGER NOT NULL,
    `seoMetaId` INTEGER NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExperienceCategory_id_key`(`id`),
    UNIQUE INDEX `ExperienceCategory_name_key`(`name`),
    UNIQUE INDEX `ExperienceCategory_imageId_key`(`imageId`),
    UNIQUE INDEX `ExperienceCategory_seoMetaId_key`(`seoMetaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceCategoryTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `mainSectionHeading` VARCHAR(191) NULL,
    `mainSectionDescription` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `ExperienceCategoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExperienceCategoryTranslation_id_key`(`id`),
    UNIQUE INDEX `ExperienceCategoryTranslation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExperienceCategory` ADD CONSTRAINT `ExperienceCategory_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceCategory` ADD CONSTRAINT `ExperienceCategory_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceCategoryTranslation` ADD CONSTRAINT `ExperienceCategoryTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceCategoryTranslation` ADD CONSTRAINT `ExperienceCategoryTranslation_ExperienceCategoryId_fkey` FOREIGN KEY (`ExperienceCategoryId`) REFERENCES `ExperienceCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
