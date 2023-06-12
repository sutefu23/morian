/*
  Warnings:

  - You are about to alter the column `thickness` on the `Item` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Item` MODIFY `thickness` DECIMAL(65, 30) NULL;
