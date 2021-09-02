/*
  Warnings:

  - You are about to drop the column `detail` on the `Reason` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `Reason` table. The data in that column could be lost. The data in that column will be cast from `Enum("Reason_status")` to `VarChar(191)`.
  - You are about to drop the column `status` on the `StockHistory` table. All the data in the column will be lost.
  - Added the required column `order` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingCount` to the `StockHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fax` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefecture` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tel` to the `Supplier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Reason` DROP COLUMN `detail`,
    MODIFY `status` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `StockHistory` DROP COLUMN `status`,
    ADD COLUMN `order` INTEGER NOT NULL,
    ADD COLUMN `remainingCount` DECIMAL(65, 30) NOT NULL;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `fax` VARCHAR(191) NOT NULL,
    ADD COLUMN `prefecture` VARCHAR(191) NOT NULL,
    ADD COLUMN `tel` VARCHAR(191) NOT NULL,
    ADD COLUMN `zip` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Book` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
