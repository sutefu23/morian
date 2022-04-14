/*
  Warnings:

  - You are about to drop the column `costUnitName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `gradeName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `unitName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `warehouseName` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Item` DROP COLUMN `costUnitName`,
    DROP COLUMN `gradeName`,
    DROP COLUMN `unitName`,
    DROP COLUMN `warehouseName`;
