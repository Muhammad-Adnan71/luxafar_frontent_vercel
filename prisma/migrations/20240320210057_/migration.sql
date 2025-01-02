/*
  Warnings:

  - You are about to drop the column `destinaitonId` on the `Destinations` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `PlaceToVisit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Destinations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Destinations_name_key` ON `Destinations`;

-- DropIndex
DROP INDEX `HolidayType_name_key` ON `HolidayType`;

-- AlterTable
ALTER TABLE `Attraction` ADD COLUMN `sortId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Destinations` DROP COLUMN `destinaitonId`,
    ADD COLUMN `destinationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `PlaceToVisit` DROP COLUMN `planId`,
    ADD COLUMN `placeId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Destinations_id_key` ON `Destinations`(`id`);
