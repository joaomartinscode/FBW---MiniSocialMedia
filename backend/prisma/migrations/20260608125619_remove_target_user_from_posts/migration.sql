/*
  Warnings:

  - You are about to drop the column `TargetUserID` on the `posts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `posts_ibfk_2`;

-- DropIndex
DROP INDEX `TargetUserID` ON `posts`;

-- AlterTable
ALTER TABLE `posts` DROP COLUMN `TargetUserID`;
