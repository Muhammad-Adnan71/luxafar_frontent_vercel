-- CreateTable
CREATE TABLE `BespokeQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `addOtherOption` BOOLEAN NULL,
    `textPlaceholder` VARCHAR(191) NULL,
    `bespokeQuestionOptionId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BespokeQuestionOptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BespokeQuestion` ADD CONSTRAINT `BespokeQuestion_bespokeQuestionOptionId_fkey` FOREIGN KEY (`bespokeQuestionOptionId`) REFERENCES `BespokeQuestionOptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
