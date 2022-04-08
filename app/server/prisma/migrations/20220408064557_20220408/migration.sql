/*
  Warnings:

  - Added the required column `costUnitName` to the `IssueItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitName` to the `IssueItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `IssueItem` ADD COLUMN `arrivalExpectedDate` VARCHAR(191) NULL,
    ADD COLUMN `costUnitName` VARCHAR(191) NOT NULL,
    ADD COLUMN `unitName` VARCHAR(191) NOT NULL;
