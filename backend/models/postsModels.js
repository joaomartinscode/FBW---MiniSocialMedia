const { prisma } = require("../lib/prisma");

async function findAllPosts() {
    return prisma.posts.findMany({
        select: {
            PostID: true,
            UserID: true,
            Content: true,
            IsPublic: true,
            CreatedAt: true
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
        select: {
            PostID: true,
            UserID: true,
            Content: true,
            IsPublic: true,
            CreatedAt: true
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
    const post = await prisma.posts.create({
        data: {
            UserID: parseInt(UserID),
            Content: Content,
            IsPublic: IsPublic === true || IsPublic === 1 || IsPublic === 'true'
        }
    });

    return findPostsById(post.PostID);
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