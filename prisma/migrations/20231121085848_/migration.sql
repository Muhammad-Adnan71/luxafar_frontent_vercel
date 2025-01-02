/*
  Warnings:

  - You are about to alter the column `imageId` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[imageId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Users` MODIFY `imageId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Users_imageId_key` ON `Users`(`imageId`);

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
