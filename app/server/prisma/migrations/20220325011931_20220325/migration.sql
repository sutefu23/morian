/*
  Warnings:

  - You are about to drop the column `ReceiveingStaff` on the `Issue` table. All the data in the column will be lost.
  - You are about to drop the column `arrivalExpectedDate` on the `IssueItem` table. All the data in the column will be lost.
  - You are about to drop the column `tempCount` on the `IssueItem` table. All the data in the column will be lost.
  - Added the required column `innerNote` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issueNote` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiveingStaff` to the `Issue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Issue` DROP COLUMN `ReceiveingStaff`,
    ADD COLUMN `innerNote` VARCHAR(191) NOT NULL,
    ADD COLUMN `issueNote` VARCHAR(191) NOT NULL,
    ADD COLUMN `receiveingStaff` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `IssueItem` DROP COLUMN `arrivalExpectedDate`,
    DROP COLUMN `tempCount`;
