-- AlterTable
ALTER TABLE `Vehicle` ADD COLUMN `automatic` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `gpsNavigation` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `heatedSeat` INTEGER NOT NULL DEFAULT 1;