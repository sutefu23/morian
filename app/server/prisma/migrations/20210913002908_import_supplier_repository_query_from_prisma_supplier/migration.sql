/*
  Warnings:

  - You are about to drop the column `costPackage` on the `Item` table. All the data in the column will be lost.
  - You are about to alter the column `arrivalDate` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Item` DROP COLUMN `costPackage`,
    MODIFY `length` VARCHAR(191),
    MODIFY `width` INTEGER,
    MODIFY `thickness` INTEGER,
    MODIFY `arrivalDate` DATETIME(3) NOT NULL;
