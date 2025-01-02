/*
  Warnings:

  - You are about to drop the column `bespokeQuestionOptionId` on the `BespokeQuestion` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `BespokeQuestion` DROP FOREIGN KEY `BespokeQuestion_bespokeQuestionOptionId_fkey`;

-- AlterTable
ALTER TABLE `BespokeQuestion` DROP COLUMN `bespokeQuestionOptionId`,
    MODIFY `addOtherOption` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `BespokeQuestionOptions` ADD COLUMN `bespokeQuestionId` INTEGER NULL;

-- CreateTable
CREATE TABLE `BespokeForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `preferredCountry` VARCHAR(191) NULL,
    `otherCountry` VARCHAR(191) NULL,
    `tripDays` VARCHAR(191) NULL,
    `gReCaptchaToken` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unread',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BespokeFormQuestionAndAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `questionId` INTEGER NOT NULL,
    `answer` VARCHAR(191) NULL,
    `additionalText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `bespokeFormId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BecomePartner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contactingAbout` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `webAddress` VARCHAR(191) NULL,
    `relevantDepartment` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `jobTitle` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `gReCaptchaToken` LONGTEXT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'unread',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BespokeQuestionOptions` ADD CONSTRAINT `BespokeQuestionOptions_bespokeQuestionId_fkey` FOREIGN KEY (`bespokeQuestionId`) REFERENCES `BespokeQuestion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD CONSTRAINT `BespokeFormQuestionAndAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BespokeQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD CONSTRAINT `BespokeFormQuestionAndAnswer_bespokeFormId_fkey` FOREIGN KEY (`bespokeFormId`) REFERENCES `BespokeForm`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
