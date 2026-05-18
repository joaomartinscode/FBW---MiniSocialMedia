const { prisma } = require('../lib/prisma');

async function getCommentsByPostId(postId) {
    return prisma.comments.findMany({
        where: {
            OR: [
                { PostID: parseInt(postId) },
                {
                    comments: {
                        PostID: parseInt(postId)
                    }
                }
            ]
        },
        select: {
            CommentID: true,
            UserID: true,
            ParentCommentID: true,
            Content: true,
            CreatedAt: true
        },
        orderBy: {
            CreatedAt: 'asc'
        }
    });
}

async function addComment(userId, postId, parentCommentId, content) {
    const newComment = await prisma.comments.create({
        data: {
            UserID: parseInt(userId),
            PostID: postId ? parseInt(postId) : null,
            ParentCommentID: parentCommentId ? parseInt(parentCommentId) : null,
            Content: content
        }
    });
    return newComment.CommentID;
}

async function removeComment(commentId, userId) {
    const result = await prisma.comments.deleteMany({
        where: {
            CommentID: parseInt(commentId),
            UserID: parseInt(userId)
        }
    });

    return result.count;
}

module.exports = { getCommentsByPostId, addComment, removeComment };