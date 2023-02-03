-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_itemId_fkey`;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
