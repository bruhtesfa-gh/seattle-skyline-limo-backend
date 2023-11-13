-- CreateTable
CREATE TABLE `user` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `img` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_email_key`(`email`),
    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehicle` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL DEFAULT '',
    `img` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `speed` DOUBLE NOT NULL DEFAULT 1,
    `automatic` INTEGER NOT NULL DEFAULT 1,
    `heatedSeat` INTEGER NOT NULL DEFAULT 1,
    `gpsNavigation` INTEGER NOT NULL DEFAULT 1,
    `pricePerDay` DOUBLE NOT NULL,
    `type` ENUM('SUV', 'BUS', 'VAN', 'SEDAN') NOT NULL,
    `passengerSize` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `book` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `fromAddress` VARCHAR(191) NOT NULL,
    `toAddress` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `luggageCount` INTEGER NOT NULL,
    `personCount` INTEGER NOT NULL,
    `journeyDate` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'COMPLETED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `vehicleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comment` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NOT NULL,
    `blogId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service` (
    `_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `img` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blog` ADD CONSTRAINT `blog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle` ADD CONSTRAINT `vehicle_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `book` ADD CONSTRAINT `book_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicle`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comment` ADD CONSTRAINT `comment_blogId_fkey` FOREIGN KEY (`blogId`) REFERENCES `blog`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service` ADD CONSTRAINT `service_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
