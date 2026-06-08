-- CreateTable
CREATE TABLE `comments` (
    `CommentID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PostID` INTEGER NULL,
    `ParentCommentID` INTEGER NULL,
    `Content` VARCHAR(200) NOT NULL,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `ParentCommentID`(`ParentCommentID`),
    INDEX `PostID`(`PostID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`CommentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friends` (
    `UserID` INTEGER NOT NULL,
    `FriendID` INTEGER NOT NULL,
    `Status` ENUM('REQUESTED', 'PENDING', 'ACCEPTED') NULL DEFAULT 'PENDING',
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FriendID`(`FriendID`),
    PRIMARY KEY (`UserID`, `FriendID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `likes` (
    `LikeID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `PostID` INTEGER NULL,
    `CommentID` INTEGER NULL,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `CommentID`(`CommentID`),
    INDEX `PostID`(`PostID`),
    UNIQUE INDEX `unique_user_comment_like`(`UserID`, `CommentID`),
    UNIQUE INDEX `unique_user_post_like`(`UserID`, `PostID`),
    PRIMARY KEY (`LikeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `posts` (
    `PostID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `TargetUserID` INTEGER NULL,
    `Content` TEXT NOT NULL,
    `IsPublic` BOOLEAN NULL DEFAULT true,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `UserID`(`UserID`),
    INDEX `TargetUserID`(`TargetUserID`),
    PRIMARY KEY (`PostID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `FullName` VARCHAR(50) NOT NULL,
    `Birthdate` DATE NULL,
    `Email` VARCHAR(50) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `IsPublicProfile` BOOLEAN NULL DEFAULT true,

    UNIQUE INDEX `Email`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`PostID`) REFERENCES `posts`(`PostID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`ParentCommentID`) REFERENCES `comments`(`CommentID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friends` ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`FriendID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`PostID`) REFERENCES `posts`(`PostID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `likes` ADD CONSTRAINT `likes_ibfk_3` FOREIGN KEY (`CommentID`) REFERENCES `comments`(`CommentID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `posts` ADD CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`TargetUserID`) REFERENCES `users`(`UserID`) ON DELETE CASCADE ON UPDATE NO ACTION;
