/*
  Warnings:

  - Added the required column `furigana` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Stock` MODIFY `defective` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Supplier` ADD COLUMN `furigana` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191),
    MODIFY `fax` VARCHAR(191),
    MODIFY `prefecture` VARCHAR(191),
    MODIFY `tel` VARCHAR(191),
    MODIFY `zip` VARCHAR(191),
    MODIFY `enable` BOOLEAN NOT NULL DEFAULT true;
