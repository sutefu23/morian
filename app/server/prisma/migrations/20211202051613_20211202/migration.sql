-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `history_ibfk_3`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `history_ibfk_2`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `history_ibfk_4`;

-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `history_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_8`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_7`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_4`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_3`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_6`;

-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `item_ibfk_2`;

-- DropForeignKey
ALTER TABLE `UserPass` DROP FOREIGN KEY `userpass_ibfk_1`;

-- AddForeignKey
ALTER TABLE `UserPass` ADD CONSTRAINT `UserPass_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_itemTypeId_fkey` FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_woodSpeciesId_fkey` FOREIGN KEY (`woodSpeciesId`) REFERENCES `Species`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_costUnitId_fkey` FOREIGN KEY (`costUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_reasonId_fkey` FOREIGN KEY (`reasonId`) REFERENCES `Reason`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_editUserId_fkey` FOREIGN KEY (`editUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_bookUserId_fkey` FOREIGN KEY (`bookUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Grade` RENAME INDEX `Grade.name_unique` TO `Grade_name_key`;

-- RenameIndex
ALTER TABLE `Grade` RENAME INDEX `Grade.order_unique` TO `Grade_order_key`;

-- RenameIndex
ALTER TABLE `Item` RENAME INDEX `Item.lotNo_unique` TO `Item_lotNo_key`;

-- RenameIndex
ALTER TABLE `ItemType` RENAME INDEX `ItemType.name_unique` TO `ItemType_name_key`;

-- RenameIndex
ALTER TABLE `ItemType` RENAME INDEX `ItemType.order_unique` TO `ItemType_order_key`;

-- RenameIndex
ALTER TABLE `Reason` RENAME INDEX `Reason.order_unique` TO `Reason_order_key`;

-- RenameIndex
ALTER TABLE `Species` RENAME INDEX `Species.name_unique` TO `Species_name_key`;

-- RenameIndex
ALTER TABLE `Species` RENAME INDEX `Species.order_unique` TO `Species_order_key`;

-- RenameIndex
ALTER TABLE `Supplier` RENAME INDEX `Supplier.name_unique` TO `Supplier_name_key`;

-- RenameIndex
ALTER TABLE `Unit` RENAME INDEX `Unit.name_unique` TO `Unit_name_key`;

-- RenameIndex
ALTER TABLE `Unit` RENAME INDEX `Unit.order_unique` TO `Unit_order_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.name_unique` TO `User_name_key`;

-- RenameIndex
ALTER TABLE `UserPass` RENAME INDEX `UserPass.userId_unique` TO `UserPass_userId_key`;

-- RenameIndex
ALTER TABLE `Warehouse` RENAME INDEX `Warehouse.name_unique` TO `Warehouse_name_key`;

-- RenameIndex
ALTER TABLE `Warehouse` RENAME INDEX `Warehouse.order_unique` TO `Warehouse_order_key`;
