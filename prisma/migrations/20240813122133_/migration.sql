-- AlterTable
ALTER TABLE `Highlights` ADD COLUMN `experienceId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `mainSectionHeading` VARCHAR(191) NULL,
    `placeName` VARCHAR(191) NULL,
    `mainSectionDescription` LONGTEXT NULL,
    `sortId` INTEGER NULL,
    `experienceSortId` INTEGER NULL,
    `imageId` INTEGER NOT NULL,
    `seoMetaId` INTEGER NULL,
    `isActive` BOOLEAN NULL DEFAULT true,
    `isFeatured` BOOLEAN NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `caughtAllRouteId` INTEGER NULL,
    `experienceCategoryId` INTEGER NOT NULL,

    UNIQUE INDEX `Experience_id_key`(`id`),
    UNIQUE INDEX `Experience_title_key`(`title`),
    UNIQUE INDEX `Experience_imageId_key`(`imageId`),
    UNIQUE INDEX `Experience_seoMetaId_key`(`seoMetaId`),
    UNIQUE INDEX `Experience_caughtAllRouteId_key`(`caughtAllRouteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExperienceTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `mainSectionHeading` VARCHAR(191) NULL,
    `placeName` VARCHAR(191) NULL,
    `mainSectionDescription` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `ExperienceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ExperienceTranslation_id_key`(`id`),
    UNIQUE INDEX `ExperienceTranslation_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DestinationsToExperience` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DestinationsToExperience_AB_unique`(`A`, `B`),
    INDEX `_DestinationsToExperience_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Highlights` ADD CONSTRAINT `Highlights_experienceId_fkey` FOREIGN KEY (`experienceId`) REFERENCES `Experience`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_experienceCategoryId_fkey` FOREIGN KEY (`experienceCategoryId`) REFERENCES `ExperienceCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Experience` ADD CONSTRAINT `Experience_caughtAllRouteId_fkey` FOREIGN KEY (`caughtAllRouteId`) REFERENCES `CaughtAllRoutes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceTranslation` ADD CONSTRAINT `ExperienceTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExperienceTranslation` ADD CONSTRAINT `ExperienceTranslation_ExperienceId_fkey` FOREIGN KEY (`ExperienceId`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DestinationsToExperience` ADD CONSTRAINT `_DestinationsToExperience_A_fkey` FOREIGN KEY (`A`) REFERENCES `Destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DestinationsToExperience` ADD CONSTRAINT `_DestinationsToExperience_B_fkey` FOREIGN KEY (`B`) REFERENCES `Experience`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
