/*
  Warnings:

  - You are about to drop the column `prefex` on the `ItemType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[prefix]` on the table `ItemType` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefix` to the `ItemType` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `ItemType_prefex_key` ON `ItemType`;

-- AlterTable
ALTER TABLE `ItemType` DROP COLUMN `prefex`,
    ADD COLUMN `prefix` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ItemType_prefix_key` ON `ItemType`(`prefix`);
