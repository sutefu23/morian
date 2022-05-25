-- DropForeignKey
ALTER TABLE `IssueItem` DROP FOREIGN KEY `IssueItem_IssueId_fkey`;

-- AddForeignKey
ALTER TABLE `IssueItem` ADD CONSTRAINT `IssueItem_IssueId_fkey` FOREIGN KEY (`IssueId`) REFERENCES `Issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
