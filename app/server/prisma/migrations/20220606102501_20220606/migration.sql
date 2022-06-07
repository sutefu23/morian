/*
  Warnings:

  - A unique constraint covering the columns `[prefex]` on the table `ItemType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefex` to the `ItemType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ItemType` ADD COLUMN `prefex` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ItemType_prefex_key` ON `ItemType`(`prefex`);
