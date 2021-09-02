/*
  Warnings:

  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_6`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_4`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_5`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_7`;

-- DropForeignKey
ALTER TABLE `StockHistory` DROP FOREIGN KEY `StockHistory_ibfk_3`;

-- DropForeignKey
ALTER TABLE `StockHistory` DROP FOREIGN KEY `StockHistory_ibfk_2`;

-- DropForeignKey
ALTER TABLE `StockHistory` DROP FOREIGN KEY `StockHistory_ibfk_1`;

-- DropTable
DROP TABLE `Stock`;

-- DropTable
DROP TABLE `StockHistory`;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL,
    `lotNo` VARCHAR(191) NOT NULL,
    `itemTypeId` INTEGER NOT NULL,
    `woodSpeciesId` INTEGER NOT NULL,
    `spec` VARCHAR(191),
    `length` VARCHAR(191) NOT NULL,
    `width` VARCHAR(191) NOT NULL,
    `thickness` VARCHAR(191) NOT NULL,
    `package` DECIMAL(65, 30) NOT NULL,
    `count` DECIMAL(65, 30) NOT NULL,
    `tempCount` DECIMAL(65, 30) NOT NULL,
    `unitId` INTEGER NOT NULL,
    `supplierId` INTEGER,
    `historyId` INTEGER,
    `arrivalDate` VARCHAR(191) NOT NULL,
    `warehouseId` INTEGER NOT NULL,
    `cost` VARCHAR(191) NOT NULL,
    `costUnit` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `defective` BOOLEAN NOT NULL DEFAULT false,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Item.lotNo_unique`(`lotNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` VARCHAR(191) NOT NULL,
    `reasonId` INTEGER NOT NULL,
    `arrivalCount` DECIMAL(65, 30) NOT NULL,
    `shippingCount` DECIMAL(65, 30) NOT NULL,
    `remainingCount` DECIMAL(65, 30) NOT NULL,
    `editUserId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `bookUserId` INTEGER NOT NULL,
    `bookDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`woodSpeciesId`) REFERENCES `Species`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`historyId`) REFERENCES `History`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD FOREIGN KEY (`reasonId`) REFERENCES `Reason`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD FOREIGN KEY (`editUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD FOREIGN KEY (`bookUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
