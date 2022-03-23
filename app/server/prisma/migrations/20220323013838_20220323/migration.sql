/*
  Warnings:

  - You are about to drop the column `arrivalExpectedDate` on the `Item` table. All the data in the column will be lost.
  - Added the required column `ReceiveingStaff` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryAddress` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectDeliveryDate` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierManagerName` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issue` ADD COLUMN `ReceiveingStaff` VARCHAR(191) NOT NULL,
    ADD COLUMN `deliveryAddress` VARCHAR(191) NOT NULL,
    ADD COLUMN `expectDeliveryDate` VARCHAR(191) NOT NULL,
    ADD COLUMN `supplierId` INTEGER NOT NULL,
    ADD COLUMN `supplierManagerName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `arrivalExpectedDate`;

-- CreateTable
CREATE TABLE `IssueItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `IssueId` INTEGER NOT NULL,
    `itemTypeId` INTEGER NOT NULL,
    `woodSpeciesId` INTEGER NULL,
    `spec` VARCHAR(191) NULL,
    `gradeId` INTEGER NULL,
    `length` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `thickness` INTEGER NULL,
    `packageCount` DECIMAL(65, 30) NOT NULL,
    `costPackageCount` DECIMAL(65, 30) NOT NULL,
    `count` DECIMAL(65, 30) NOT NULL,
    `tempCount` DECIMAL(65, 30) NOT NULL,
    `unitId` INTEGER NOT NULL,
    `arrivalExpectedDate` VARCHAR(191) NULL,
    `cost` DECIMAL(65, 30) NOT NULL,
    `costUnitId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_IssueId_fkey` FOREIGN KEY (`IssueId`) REFERENCES `Issue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_itemTypeId_fkey` FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_woodSpeciesId_fkey` FOREIGN KEY (`woodSpeciesId`) REFERENCES `Species`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_costUnitId_fkey` FOREIGN KEY (`costUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
