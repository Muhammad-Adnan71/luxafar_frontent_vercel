-- AlterTable
ALTER TABLE `Inspirations` ADD COLUMN `homePageSortId` INTEGER NULL,
    ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `isHomePageSort` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PlaceToVisit` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `ThingsToDo` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Tours` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sortId` INTEGER NULL;
