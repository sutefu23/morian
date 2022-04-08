/*
  Warnings:

  - Added the required column `deliveryPlaceName` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierName` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issue` ADD COLUMN `deliveryPlaceName` VARCHAR(191) NOT NULL,
    ADD COLUMN `supplierName` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL;
