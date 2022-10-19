/*
  Warnings:

  - You are about to alter the column `packageCount` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Item` ADD COLUMN `costPackageCount` DECIMAL(65, 30) NULL,
    MODIFY `packageCount` DECIMAL(65, 30) NULL;
