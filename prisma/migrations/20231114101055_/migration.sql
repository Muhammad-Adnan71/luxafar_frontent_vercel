/*
  Warnings:

  - A unique constraint covering the columns `[seoMetaId]` on the table `Inspirations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `InspirationDetail` ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Inspirations` ADD COLUMN `seoMetaId` INTEGER NULL;

-- CreateTable
CREATE TABLE `SeoMeta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `slug` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Inspirations_seoMetaId_key` ON `Inspirations`(`seoMetaId`);

-- AddForeignKey
ALTER TABLE `Inspirations` ADD CONSTRAINT `Inspirations_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
