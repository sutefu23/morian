-- AlterTable
ALTER TABLE `Issue` ADD COLUMN `isStored` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `issueItemId` INTEGER NULL;
