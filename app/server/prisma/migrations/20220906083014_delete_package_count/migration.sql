/*
  Warnings:

  - You are about to drop the column `packageCountUnitId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `packageCountUnitName` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Item` DROP COLUMN `packageCountUnitId`,
    DROP COLUMN `packageCountUnitName`;
