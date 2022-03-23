/*
  Warnings:

  - Added the required column `deliveryPlaceId` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issue` ADD COLUMN `deliveryPlaceId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `DeliveryPlace` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `DeliveryPlace_name_key`(`name`),
    UNIQUE INDEX `DeliveryPlace_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_deliveryPlaceId_fkey` FOREIGN KEY (`deliveryPlaceId`) REFERENCES `DeliveryPlace`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
