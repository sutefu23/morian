/*
  Warnings:

  - Added the required column `isTemp` to the `History` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `isTemp` BOOLEAN NOT NULL,
    ADD COLUMN `status` INTEGER NOT NULL,
    MODIFY `bookUserId` INTEGER,
    MODIFY `bookDate` DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3);
