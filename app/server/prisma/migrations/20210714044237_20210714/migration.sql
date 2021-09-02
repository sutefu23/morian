/*
  Warnings:

  - You are about to drop the column `itemType` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `StockHistory` table. All the data in the column will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[order]` on the table `Reason` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Species` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `Reason` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Species` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemTypeId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bookUserId` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `editUserId` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enable` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Unit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Warehouse` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Book` DROP FOREIGN KEY `Book_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Stock` DROP FOREIGN KEY `Stock_ibfk_1`;

-- DropForeignKey
ALTER TABLE `StockHistory` DROP FOREIGN KEY `StockHistory_ibfk_2`;

-- AlterTable
ALTER TABLE `Reason` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Species` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Stock` DROP COLUMN `itemType`,
    ADD COLUMN `itemTypeId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `StockHistory` DROP COLUMN `userId`,
    ADD COLUMN `bookDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `bookUserId` INTEGER NOT NULL,
    ADD COLUMN `editUserId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `enable` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Unit` ADD COLUMN `order` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Warehouse` ADD COLUMN `order` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Book`;

-- CreateTable
CREATE TABLE `ItemType` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `ItemType.name_unique`(`name`),
    UNIQUE INDEX `ItemType.order_unique`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Reason.order_unique` ON `Reason`(`order`);

-- CreateIndex
CREATE UNIQUE INDEX `Species.order_unique` ON `Species`(`order`);

-- CreateIndex
CREATE UNIQUE INDEX `Unit.order_unique` ON `Unit`(`order`);

-- CreateIndex
CREATE UNIQUE INDEX `Warehouse.order_unique` ON `Warehouse`(`order`);

-- AddForeignKey
ALTER TABLE `Stock` ADD FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Stock` ADD FOREIGN KEY (`woodSpeciesId`) REFERENCES `Species`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD FOREIGN KEY (`editUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StockHistory` ADD FOREIGN KEY (`bookUserId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
