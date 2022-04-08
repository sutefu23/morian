/*
  Warnings:

  - Added the required column `itemTypeName` to the `IssueItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `IssueItem` ADD COLUMN `gradeName` VARCHAR(191) NULL,
    ADD COLUMN `itemTypeName` VARCHAR(191) NOT NULL,
    ADD COLUMN `woodSpeciesName` VARCHAR(191) NULL;
