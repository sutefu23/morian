/*
  Warnings:

  - You are about to drop the column `count` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `costUnit` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `defective` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `package` on the `Item` table. All the data in the column will be lost.
  - You are about to alter the column `width` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `thickness` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `cost` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.
  - You are about to alter the column `status` on the `Reason` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `date` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPackage` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costPackageCount` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `costUnitId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defectiveNote` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeId` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packageCount` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Reason` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` DROP COLUMN `count`,
    ADD COLUMN `date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `costUnit`,
    DROP COLUMN `defective`,
    DROP COLUMN `package`,
    ADD COLUMN `costPackage` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `costPackageCount` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `costUnitId` INTEGER NOT NULL,
    ADD COLUMN `defectiveNote` VARCHAR(191) NOT NULL,
    ADD COLUMN `gradeId` INTEGER NOT NULL,
    ADD COLUMN `packageCount` DECIMAL(65, 30) NOT NULL,
    MODIFY `width` INTEGER NOT NULL,
    MODIFY `thickness` INTEGER NOT NULL,
    MODIFY `cost` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Reason` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    MODIFY `status` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Grade.name_unique`(`name`),
    UNIQUE INDEX `Grade.order_unique`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD FOREIGN KEY (`costUnitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
