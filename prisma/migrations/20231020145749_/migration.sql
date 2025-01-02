-- DropForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` DROP FOREIGN KEY `BespokeFormQuestionAndAnswer_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `BespokeQuestionOptions` DROP FOREIGN KEY `BespokeQuestionOptions_bespokeQuestionId_fkey`;

-- AddForeignKey
ALTER TABLE `BespokeQuestionOptions` ADD CONSTRAINT `BespokeQuestionOptions_bespokeQuestionId_fkey` FOREIGN KEY (`bespokeQuestionId`) REFERENCES `BespokeQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD CONSTRAINT `BespokeFormQuestionAndAnswer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `BespokeQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
