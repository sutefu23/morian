-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_gradeId_fkey`;

-- AlterTable
ALTER TABLE `Item` MODIFY `gradeId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
