-- AlterTable
ALTER TABLE `Item` ADD COLUMN `packageCountUnitId` INTEGER NULL,
    ADD COLUMN `packageCountUnitName` VARCHAR(191) NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_packageCountUnitId_fkey` FOREIGN KEY (`packageCountUnitId`) REFERENCES `Unit`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
