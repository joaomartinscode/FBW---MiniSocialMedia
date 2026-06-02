const { prisma } = require("../lib/prisma");

function findAllPosts(userId, friendIds) {
    console.log('[DEBUG] Model findAllPosts called with:', { userId, friendIds });
    return prisma.posts.findMany({
        where: {
            OR: [
                { IsPublic: true },
                { IsPublic: { equals: null } },
                { UserID: Number(userId) },
                {
                    AND: [
                        { IsPublic: false },
                        { UserID: { in: friendIds.map((id) => Number(id)) } }
                    ]
                }
            ]
        },
        include: {
            users: {
                select: {
                    FullName: true
                }
            }
        },
        orderBy: {
            CreatedAt: 'desc'
        }
    });
}
async function findPostsByUserId(id) {
    return prisma.posts.findMany({
        where: {
            UserID: parseInt(id)
        },
        include: {
            users: {
                select: {
                    FullName: true
                }
            }
         },
        orderBy: {
            CreatedAt: 'desc'
        }
    });
}

async function findPostsById(id) {
    return prisma.posts.findUnique({
        where: {
            PostID: parseInt(id)
        },
        select: {
            PostID: true,
            UserID: true,
            Content: true,
            IsPublic: true,
            CreatedAt: true
        }
    });
}

async function addPost(UserID, Content, IsPublic) {
    return prisma.posts.create({
        data: {
            UserID: parseInt(UserID),
            Content: Content,
            IsPublic: IsPublic === true || IsPublic === 1 || IsPublic === 'true'
        },
        include: {
            users: {
                select: {
                    FullName: true
                }
            }
        }
    });
}

async function removePost(postId, userId) {
    try {
        const result = await prisma.posts.deleteMany({
            where: {
                PostID: parseInt(postId),
                UserID: parseInt(userId)
            }
        });
        return result.count;
    } catch (error) {
        return 0;
    }
}

async function editPost(postId, userId, newContent, newIsPublic) {
    try {
        const result = await prisma.posts.updateMany({
            where: {
                PostID: parseInt(postId),
                UserID: parseInt(userId)
            },
            data: {
                Content: newContent,
                IsPublic: newIsPublic === true || newIsPublic === 1 || newIsPublic === 'true'
            }
        });
        return result.count;
    } catch (error) {
        return 0;
    }
}

module.exports = { findAllPosts, findPostsByUserId, findPostsById, addPost, removePost, editPost };
