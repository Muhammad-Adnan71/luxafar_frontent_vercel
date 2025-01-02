/*
  Warnings:

  - A unique constraint covering the columns `[seoMetaId]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Pages` ADD COLUMN `seoMetaId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Pages_seoMetaId_key` ON `Pages`(`seoMetaId`);

-- AddForeignKey
ALTER TABLE `Pages` ADD CONSTRAINT `Pages_seoMetaId_fkey` FOREIGN KEY (`seoMetaId`) REFERENCES `SeoMeta`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
