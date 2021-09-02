/*
  Warnings:

  - You are about to drop the column `arrivalCount` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `remainingCount` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCount` on the `History` table. All the data in the column will be lost.
  - Added the required column `addCount` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reduceCount` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` DROP COLUMN `arrivalCount`,
    DROP COLUMN `remainingCount`,
    DROP COLUMN `shippingCount`,
    ADD COLUMN `addCount` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `count` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `reduceCount` DECIMAL(65, 30) NOT NULL;
