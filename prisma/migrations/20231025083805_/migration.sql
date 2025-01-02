-- DropForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` DROP FOREIGN KEY `BespokeFormQuestionAndAnswer_bespokeFormId_fkey`;

-- AlterTable
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD COLUMN `becomePartnerFormId` INTEGER NULL;

-- AlterTable
ALTER TABLE `BespokeQuestion` ADD COLUMN `formType` VARCHAR(191) NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD CONSTRAINT `BespokeFormQuestionAndAnswer_bespokeFormId_fkey` FOREIGN KEY (`bespokeFormId`) REFERENCES `BespokeForm`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeFormQuestionAndAnswer` ADD CONSTRAINT `BespokeFormQuestionAndAnswer_becomePartnerFormId_fkey` FOREIGN KEY (`becomePartnerFormId`) REFERENCES `BecomePartner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
