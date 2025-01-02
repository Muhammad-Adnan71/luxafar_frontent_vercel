/*
  Warnings:

  - You are about to drop the column `attractionId` on the `Attraction` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Attraction` table. All the data in the column will be lost.
  - You are about to drop the column `bannerId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Banner` table. All the data in the column will be lost.
  - You are about to drop the column `bespokeQuestionId` on the `BespokeQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `BespokeQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `BespokeQuestionOptionId` on the `BespokeQuestionOptions` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `BespokeQuestionOptions` table. All the data in the column will be lost.
  - You are about to drop the column `contentId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `dayToDayId` on the `DayToDayItinerary` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `DayToDayItinerary` table. All the data in the column will be lost.
  - You are about to drop the column `destinationFeatureOfferedId` on the `DestinationFeatureOffered` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `DestinationFeatureOffered` table. All the data in the column will be lost.
  - You are about to drop the column `featureId` on the `DestinationFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `DestinationFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `destinationId` on the `Destinations` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Destinations` table. All the data in the column will be lost.
  - You are about to drop the column `faqId` on the `Faqs` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Faqs` table. All the data in the column will be lost.
  - You are about to drop the column `highlightId` on the `Highlights` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Highlights` table. All the data in the column will be lost.
  - You are about to drop the column `holidayId` on the `HolidayType` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `HolidayType` table. All the data in the column will be lost.
  - You are about to drop the column `inspirationDetailId` on the `InspirationDetail` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `InspirationDetail` table. All the data in the column will be lost.
  - You are about to drop the column `inspirationId` on the `Inspirations` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Inspirations` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `PlaceToVisit` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `PlaceToVisit` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `PlanService` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `PlanService` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `PrivatePlan` table. All the data in the column will be lost.
  - You are about to drop the column `privatePlanId` on the `PrivatePlan` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `SeasonToVisit` table. All the data in the column will be lost.
  - You are about to drop the column `seasonId` on the `SeasonToVisit` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `SupplementPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `supplementId` on the `SupplementPolicy` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `testimonialId` on the `Testimonial` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `ThingsToDo` table. All the data in the column will be lost.
  - You are about to drop the column `thingId` on the `ThingsToDo` table. All the data in the column will be lost.
  - You are about to drop the column `langId` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `tourId` on the `Tours` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Destinations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `HolidayType` will be added. If there are existing duplicate values, this will fail.
  - Made the column `imageId` on table `Banner` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Attraction` DROP FOREIGN KEY `Attraction_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Banner` DROP FOREIGN KEY `Banner_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `Banner` DROP FOREIGN KEY `Banner_langId_fkey`;

-- DropForeignKey
ALTER TABLE `BespokeQuestion` DROP FOREIGN KEY `BespokeQuestion_langId_fkey`;

-- DropForeignKey
ALTER TABLE `BespokeQuestionOptions` DROP FOREIGN KEY `BespokeQuestionOptions_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Content` DROP FOREIGN KEY `Content_langId_fkey`;

-- DropForeignKey
ALTER TABLE `DayToDayItinerary` DROP FOREIGN KEY `DayToDayItinerary_langId_fkey`;

-- DropForeignKey
ALTER TABLE `DestinationFeatureOffered` DROP FOREIGN KEY `DestinationFeatureOffered_langId_fkey`;

-- DropForeignKey
ALTER TABLE `DestinationFeatures` DROP FOREIGN KEY `DestinationFeatures_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Destinations` DROP FOREIGN KEY `Destinations_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Faqs` DROP FOREIGN KEY `Faqs_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Highlights` DROP FOREIGN KEY `Highlights_langId_fkey`;

-- DropForeignKey
ALTER TABLE `HolidayType` DROP FOREIGN KEY `HolidayType_langId_fkey`;

-- DropForeignKey
ALTER TABLE `InspirationDetail` DROP FOREIGN KEY `InspirationDetail_imageId_fkey`;

-- DropForeignKey
ALTER TABLE `InspirationDetail` DROP FOREIGN KEY `InspirationDetail_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Inspirations` DROP FOREIGN KEY `Inspirations_langId_fkey`;

-- DropForeignKey
ALTER TABLE `PlaceToVisit` DROP FOREIGN KEY `PlaceToVisit_langId_fkey`;

-- DropForeignKey
ALTER TABLE `PlanService` DROP FOREIGN KEY `PlanService_langId_fkey`;

-- DropForeignKey
ALTER TABLE `PrivatePlan` DROP FOREIGN KEY `PrivatePlan_langId_fkey`;

-- DropForeignKey
ALTER TABLE `SeasonToVisit` DROP FOREIGN KEY `SeasonToVisit_langId_fkey`;

-- DropForeignKey
ALTER TABLE `SupplementPolicy` DROP FOREIGN KEY `SupplementPolicy_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Testimonial` DROP FOREIGN KEY `Testimonial_langId_fkey`;

-- DropForeignKey
ALTER TABLE `ThingsToDo` DROP FOREIGN KEY `ThingsToDo_langId_fkey`;

-- DropForeignKey
ALTER TABLE `Tours` DROP FOREIGN KEY `Tours_langId_fkey`;

-- DropIndex
DROP INDEX `Destinations_id_key` ON `Destinations`;

-- AlterTable
ALTER TABLE `Attraction` DROP COLUMN `attractionId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `Banner` DROP COLUMN `bannerId`,
    DROP COLUMN `langId`,
    MODIFY `imageId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `BespokeQuestion` DROP COLUMN `bespokeQuestionId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `BespokeQuestionOptions` DROP COLUMN `BespokeQuestionOptionId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `Content` DROP COLUMN `contentId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `DayToDayItinerary` DROP COLUMN `dayToDayId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `DestinationFeatureOffered` DROP COLUMN `destinationFeatureOfferedId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `DestinationFeatures` DROP COLUMN `featureId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `Destinations` DROP COLUMN `destinationId`,
    DROP COLUMN `langId`,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Faqs` DROP COLUMN `faqId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `Highlights` DROP COLUMN `highlightId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `HolidayType` DROP COLUMN `holidayId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `InspirationDetail` DROP COLUMN `inspirationDetailId`,
    DROP COLUMN `langId`,
    MODIFY `imageId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Inspirations` DROP COLUMN `inspirationId`,
    DROP COLUMN `langId`;

-- AlterTable
ALTER TABLE `PlaceToVisit` DROP COLUMN `langId`,
    DROP COLUMN `placeId`;

-- AlterTable
ALTER TABLE `PlanService` DROP COLUMN `langId`,
    DROP COLUMN `planId`;

-- AlterTable
ALTER TABLE `PrivatePlan` DROP COLUMN `langId`,
    DROP COLUMN `privatePlanId`;

-- AlterTable
ALTER TABLE `SeasonToVisit` DROP COLUMN `langId`,
    DROP COLUMN `seasonId`;

-- AlterTable
ALTER TABLE `SupplementPolicy` DROP COLUMN `langId`,
    DROP COLUMN `supplementId`;

-- AlterTable
ALTER TABLE `Testimonial` DROP COLUMN `langId`,
    DROP COLUMN `testimonialId`;

-- AlterTable
ALTER TABLE `ThingsToDo` DROP COLUMN `langId`,
    DROP COLUMN `thingId`;

-- AlterTable
ALTER TABLE `Tours` DROP COLUMN `langId`,
    DROP COLUMN `tourId`;

-- CreateTable
CREATE TABLE `ContentTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `subTitle` VARCHAR(191) NULL,
    `buttonText` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `contentId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ContentTranslation_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `langId` INTEGER NOT NULL,
    `destinationId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationFeaturesTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `destinationFeatureId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DestinationFeatureOfferedTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `langId` INTEGER NOT NULL,
    `destinationFeatureOfferedId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HolidayTypeTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `mainSectionHeading` VARCHAR(191) NULL,
    `mainSectionDescription` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `holidayId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `HolidayTypeTranslation_id_key`(`id`),
    UNIQUE INDEX `HolidayTypeTranslation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HighlightsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `highlightId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspirationsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `inspirationId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspirationDetailTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `inspirationDetailId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BannerTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `buttonText` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `bannerId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestimonialTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` LONGTEXT NULL,
    `clientName` VARCHAR(191) NULL,
    `clientLocation` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `testimonialId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaqsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,
    `answer` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `faqId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConfigurationTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `siteDescription` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `configurationId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlaceToVisitTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `attractionTitle` VARCHAR(191) NULL,
    `attractionDescription` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `placeToVisitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttractionTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `attractionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SeasonToVisitTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `eventOccasions` LONGTEXT NULL,
    `period` VARCHAR(191) NULL,
    `temperature` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `seasonToVisitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThingsToDoTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `thingToDoId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanServiceTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `langId` INTEGER NOT NULL,
    `planServiceId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ToursTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NULL,
    `meetingPoint` VARCHAR(191) NULL,
    `departurePoint` VARCHAR(191) NULL,
    `travelingFromDescription` LONGTEXT NULL,
    `weatherDescription` LONGTEXT NULL,
    `whenToGoDescription` LONGTEXT NULL,
    `cuisineDescription` LONGTEXT NULL,
    `overviewTitle` VARCHAR(191) NULL,
    `overviewDescription` LONGTEXT NULL,
    `pricingTitle` VARCHAR(191) NULL,
    `pricingDescription` LONGTEXT NULL,
    `physicalActivityDescription` LONGTEXT NULL,
    `makeItPrivateDescription` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `tourId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DayToDayItineraryTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `destination` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `accommodation` VARCHAR(191) NULL,
    `langId` INTEGER NOT NULL,
    `dayTodayItineraryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplementPolicyTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `subTitle` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `supplementryPolicyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BespokeQuestionTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` LONGTEXT NULL,
    `textPlaceholder` LONGTEXT NULL,
    `langId` INTEGER NOT NULL,
    `bespokeQuestionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BespokeQuestionOptionsTranslation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `bespokeQuestionId` INTEGER NULL,
    `langId` INTEGER NOT NULL,
    `bespokeQuestionOptionsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Destinations_name_key` ON `Destinations`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `HolidayType_name_key` ON `HolidayType`(`name`);

-- AddForeignKey
ALTER TABLE `ContentTranslation` ADD CONSTRAINT `ContentTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ContentTranslation` ADD CONSTRAINT `ContentTranslation_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `Content`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationsTranslation` ADD CONSTRAINT `DestinationsTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationsTranslation` ADD CONSTRAINT `DestinationsTranslation_destinationId_fkey` FOREIGN KEY (`destinationId`) REFERENCES `Destinations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeaturesTranslation` ADD CONSTRAINT `DestinationFeaturesTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeaturesTranslation` ADD CONSTRAINT `DestinationFeaturesTranslation_destinationFeatureId_fkey` FOREIGN KEY (`destinationFeatureId`) REFERENCES `DestinationFeatures`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeatureOfferedTranslation` ADD CONSTRAINT `DestinationFeatureOfferedTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DestinationFeatureOfferedTranslation` ADD CONSTRAINT `DestinationFeatureOfferedTranslation_destinationFeatureOffe_fkey` FOREIGN KEY (`destinationFeatureOfferedId`) REFERENCES `DestinationFeatureOffered`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HolidayTypeTranslation` ADD CONSTRAINT `HolidayTypeTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HolidayTypeTranslation` ADD CONSTRAINT `HolidayTypeTranslation_holidayId_fkey` FOREIGN KEY (`holidayId`) REFERENCES `HolidayType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighlightsTranslation` ADD CONSTRAINT `HighlightsTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HighlightsTranslation` ADD CONSTRAINT `HighlightsTranslation_highlightId_fkey` FOREIGN KEY (`highlightId`) REFERENCES `Highlights`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationsTranslation` ADD CONSTRAINT `InspirationsTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationsTranslation` ADD CONSTRAINT `InspirationsTranslation_inspirationId_fkey` FOREIGN KEY (`inspirationId`) REFERENCES `Inspirations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationDetail` ADD CONSTRAINT `InspirationDetail_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationDetailTranslation` ADD CONSTRAINT `InspirationDetailTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspirationDetailTranslation` ADD CONSTRAINT `InspirationDetailTranslation_inspirationDetailId_fkey` FOREIGN KEY (`inspirationDetailId`) REFERENCES `InspirationDetail`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Banner` ADD CONSTRAINT `Banner_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `Media`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BannerTranslation` ADD CONSTRAINT `BannerTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BannerTranslation` ADD CONSTRAINT `BannerTranslation_bannerId_fkey` FOREIGN KEY (`bannerId`) REFERENCES `Banner`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestimonialTranslation` ADD CONSTRAINT `TestimonialTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TestimonialTranslation` ADD CONSTRAINT `TestimonialTranslation_testimonialId_fkey` FOREIGN KEY (`testimonialId`) REFERENCES `Testimonial`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FaqsTranslation` ADD CONSTRAINT `FaqsTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FaqsTranslation` ADD CONSTRAINT `FaqsTranslation_faqId_fkey` FOREIGN KEY (`faqId`) REFERENCES `Faqs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigurationTranslation` ADD CONSTRAINT `ConfigurationTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConfigurationTranslation` ADD CONSTRAINT `ConfigurationTranslation_configurationId_fkey` FOREIGN KEY (`configurationId`) REFERENCES `Configuration`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceToVisitTranslation` ADD CONSTRAINT `PlaceToVisitTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlaceToVisitTranslation` ADD CONSTRAINT `PlaceToVisitTranslation_placeToVisitId_fkey` FOREIGN KEY (`placeToVisitId`) REFERENCES `PlaceToVisit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttractionTranslation` ADD CONSTRAINT `AttractionTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttractionTranslation` ADD CONSTRAINT `AttractionTranslation_attractionId_fkey` FOREIGN KEY (`attractionId`) REFERENCES `Attraction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeasonToVisitTranslation` ADD CONSTRAINT `SeasonToVisitTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SeasonToVisitTranslation` ADD CONSTRAINT `SeasonToVisitTranslation_seasonToVisitId_fkey` FOREIGN KEY (`seasonToVisitId`) REFERENCES `SeasonToVisit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThingsToDoTranslation` ADD CONSTRAINT `ThingsToDoTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThingsToDoTranslation` ADD CONSTRAINT `ThingsToDoTranslation_thingToDoId_fkey` FOREIGN KEY (`thingToDoId`) REFERENCES `ThingsToDo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanServiceTranslation` ADD CONSTRAINT `PlanServiceTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PlanServiceTranslation` ADD CONSTRAINT `PlanServiceTranslation_planServiceId_fkey` FOREIGN KEY (`planServiceId`) REFERENCES `PlanService`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ToursTranslation` ADD CONSTRAINT `ToursTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ToursTranslation` ADD CONSTRAINT `ToursTranslation_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `Tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DayToDayItineraryTranslation` ADD CONSTRAINT `DayToDayItineraryTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DayToDayItineraryTranslation` ADD CONSTRAINT `DayToDayItineraryTranslation_dayTodayItineraryId_fkey` FOREIGN KEY (`dayTodayItineraryId`) REFERENCES `DayToDayItinerary`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplementPolicyTranslation` ADD CONSTRAINT `SupplementPolicyTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplementPolicyTranslation` ADD CONSTRAINT `SupplementPolicyTranslation_supplementryPolicyId_fkey` FOREIGN KEY (`supplementryPolicyId`) REFERENCES `SupplementPolicy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestionTranslation` ADD CONSTRAINT `BespokeQuestionTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestionTranslation` ADD CONSTRAINT `BespokeQuestionTranslation_bespokeQuestionId_fkey` FOREIGN KEY (`bespokeQuestionId`) REFERENCES `BespokeQuestion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestionOptionsTranslation` ADD CONSTRAINT `BespokeQuestionOptionsTranslation_langId_fkey` FOREIGN KEY (`langId`) REFERENCES `Languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BespokeQuestionOptionsTranslation` ADD CONSTRAINT `BespokeQuestionOptionsTranslation_bespokeQuestionOptionsId_fkey` FOREIGN KEY (`bespokeQuestionOptionsId`) REFERENCES `BespokeQuestionOptions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
