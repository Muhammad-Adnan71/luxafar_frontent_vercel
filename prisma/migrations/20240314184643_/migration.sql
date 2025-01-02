/*
  Warnings:

  - Added the required column `contentId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Content` ADD COLUMN `contentId` INTEGER NOT NULL,
    ADD COLUMN `langId` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `Languages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lang` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Languages_lang_key`(`lang`),
    UNIQUE INDEX `Languages_locale_key`(`locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Content` ADD CONSTRAINT `Content_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
