/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Faqs` table. All the data in the column will be lost.
  - You are about to drop the column `sortId` on the `Faqs` table. All the data in the column will be lost.
  - You are about to drop the column `tourId` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Testimonial` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Testimonial` DROP FOREIGN KEY `Testimonial_tourId_fkey`;

-- AlterTable
ALTER TABLE `Faqs` DROP COLUMN `isDeleted`,
    DROP COLUMN `sortId`;

-- AlterTable
ALTER TABLE `Testimonial` DROP COLUMN `tourId`,
    DROP COLUMN `type`,
    ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sortId` INTEGER NULL;
