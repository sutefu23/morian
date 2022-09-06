-- AlterTable
ALTER TABLE `IssueItem` ADD COLUMN `packageCountUnitId` DECIMAL(65, 30) NULL,
    ADD COLUMN `packageCountUnitName` DECIMAL(65, 30) NULL;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `packageCountUnitId` DECIMAL(65, 30) NULL,
    ADD COLUMN `packageCountUnitName` DECIMAL(65, 30) NULL;
