/*
  Warnings:

  - You are about to drop the column `historyId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `itemId` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_ibfk_5`;

-- AlterTable
ALTER TABLE `History` ADD COLUMN `itemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `historyId`;

-- AddForeignKey
ALTER TABLE `History` ADD FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
