-- CreateTable
CREATE TABLE `Task` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `done` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pass` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `UserPass_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lotNo` VARCHAR(191) NOT NULL,
    `itemTypeId` INTEGER NOT NULL,
    `woodSpeciesId` INTEGER NULL,
    `spec` VARCHAR(191) NULL,
    `gradeId` INTEGER NOT NULL,
    `length` VARCHAR(191) NULL,
    `width` INTEGER NULL,
    `thickness` INTEGER NULL,
    `packageCount` DECIMAL(65, 30) NOT NULL,
    `costPackageCount` DECIMAL(65, 30) NOT NULL,
    `count` DECIMAL(65, 30) NOT NULL,
    `tempCount` DECIMAL(65, 30) NOT NULL,
    `unitId` INTEGER NOT NULL,
    `supplierId` INTEGER NULL,
    `arrivalDate` DATETIME(3) NOT NULL,
    `arrivalExpectedDate` DATETIME(3) NULL,
    `warehouseId` INTEGER NOT NULL,
    `cost` DECIMAL(65, 30) NOT NULL,
    `costUnitId` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `manufacturer` VARCHAR(191) NULL,
    `defectiveNote` VARCHAR(191) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Item_lotNo_key`(`lotNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Unit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Unit_name_key`(`name`),
    UNIQUE INDEX `Unit_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `furigana` VARCHAR(191) NOT NULL,
    `zip` VARCHAR(191) NULL,
    `prefecture` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `tel` VARCHAR(191) NULL,
    `fax` VARCHAR(191) NULL,
    `enable` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Supplier_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `ItemType_name_key`(`name`),
    UNIQUE INDEX `ItemType_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Species_name_key`(`name`),
    UNIQUE INDEX `Species_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Warehouse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Warehouse_name_key`(`name`),
    UNIQUE INDEX `Warehouse_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Grade_name_key`(`name`),
    UNIQUE INDEX `Grade_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `reasonId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `isTemp` BOOLEAN NOT NULL,
    `reduceCount` DECIMAL(65, 30) NOT NULL,
    `addCount` DECIMAL(65, 30) NOT NULL,
    `editUserId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,
    `bookUserId` INTEGER NULL,
    `bookDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reason` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `Reason_order_key`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserPass` ADD CONSTRAINT `UserPass_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_itemTypeId_fkey` FOREIGN KEY (`itemTypeId`) REFERENCES `ItemType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_woodSpeciesId_fkey` FOREIGN KEY (`woodSpeciesId`) REFERENCES `Species`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_gradeId_fkey` FOREIGN KEY (`gradeId`) REFERENCES `Grade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `Supplier`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_warehouseId_fkey` FOREIGN KEY (`warehouseId`) REFERENCES `Warehouse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_costUnitId_fkey` FOREIGN KEY (`costUnitId`) REFERENCES `Unit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_reasonId_fkey` FOREIGN KEY (`reasonId`) REFERENCES `Reason`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_itemId_fkey` FOREIGN KEY (`itemId`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_editUserId_fkey` FOREIGN KEY (`editUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_bookUserId_fkey` FOREIGN KEY (`bookUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
