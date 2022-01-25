/*
  Warnings:

  - Added the required column `manufacturer` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Item` ADD COLUMN `arrivalExpectedDate` DATETIME(3) NULL,
    ADD COLUMN `manufacturer` VARCHAR(191) NOT NULL;
