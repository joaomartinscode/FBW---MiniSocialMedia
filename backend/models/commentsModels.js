const { prisma } = require('../lib/prisma');

async function getCommentsByPostId(postId) {
    return prisma.comments.findMany({
        where: {
            PostID: parseInt(postId),
            ParentCommentID: null 
        },
        include: {
            users: {
                select: { FullName: true }
            },
            other_comments: { 
                include: {
                    users: { select: { FullName: true } },
                    other_comments: {
                        include: {
                            users: { select: { FullName: true } },
                            other_comments: {
                                include: {
                                    users: { select: { FullName: true } }
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            CreatedAt: 'asc'
        }
    });
}

async function addComment(userId, postId, parentCommentId, content) {
    let finalPostId = null;
    let finalParentId = null;

    if (parentCommentId) {
        finalParentId = parseInt(parentCommentId);
        finalPostId = null;
    } else if (postId) {
        finalPostId = parseInt(postId);
        finalParentId = null;
    }

    const newComment = await prisma.comments.create({
        data: {
            UserID: parseInt(userId),
            PostID: finalPostId,
            ParentCommentID: finalParentId,
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