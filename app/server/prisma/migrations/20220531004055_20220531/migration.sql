-- AlterTable
ALTER TABLE `Item` ADD COLUMN `costUnitName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `gradeName` VARCHAR(191) NULL,
    ADD COLUMN `itemTypeName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `unitName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `warehouseName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `woodSpeciesName` VARCHAR(191) NULL;
