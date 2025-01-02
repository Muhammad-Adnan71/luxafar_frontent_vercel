-- AlterTable
ALTER TABLE `BespokeFormQuestionAndAnswer` MODIFY `answer` LONGTEXT NULL,
    MODIFY `additionalText` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `BespokeQuestion` MODIFY `question` LONGTEXT NULL,
    MODIFY `textPlaceholder` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Forms` MODIFY `message` LONGTEXT NULL,
    MODIFY `subject` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Partners` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false;
