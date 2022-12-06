/*
  Warnings:

  - Made the column `arrivalDate` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Item` MODIFY `arrivalDate` DATETIME(3) NOT NULL;
