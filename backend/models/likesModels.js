const { prisma } = require('../lib/prisma');

async function toggleLike(userId, postId, commentId) {
    const pId = postId ? parseInt(postId) : null;
    const cId = commentId ? parseInt(commentId) : null;

    const existing = await prisma.likes.findFirst({
        where: {
            UserID: parseInt(userId),
            PostID: pId,
            CommentID: cId
        },
        select: {
            LikeID: true
        }
    });

    if (existing) {
        await prisma.likes.delete({
            where: {
                LikeID: existing.LikeID
            }
        });
        return { liked: false, affectedRows: 1 };
    } else {
        const newLike = await prisma.likes.create({
            data: {
                UserID: parseInt(userId),
                PostID: pId,
                CommentID: cId
            }
        });
        return { liked: true, insertId: newLike.LikeID };
    }
}

async function getLikesCount(postId, commentId, userId = null) {
    const whereClause = {
        PostID: postId ? parseInt(postId) : null,
        CommentID: commentId ? parseInt(commentId) : null,
    };

    
    const totalLikes = await prisma.likes.count({
        where: whereClause
    });

    
    let hasLiked = false;
    if (userId) {
        const record = await prisma.likes.findFirst({
            where: {
                ...whereClause,
                UserID: parseInt(userId)
            }
        });
        hasLiked = !!record;
    }

    return { totalLikes, hasLiked };
}

module.exports = { toggleLike, getLikesCount };