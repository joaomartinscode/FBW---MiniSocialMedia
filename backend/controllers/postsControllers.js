const postsModel = require('../models/postsModels');
const friendsModel = require('../models/friendsModels');
const userModel = require('../models/usersModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function findAllPosts(req, res) {
    try {
        const userId = req.user.userId;
        console.log(`[DEBUG] Controller findAllPosts for user: ${userId}`);

        const friendIds = await friendsModel.findAllFriendIds(userId);


        const posts = await postsModel.findAllPosts(userId, friendIds);
        console.log(`[DEBUG] Posts found: ${posts.length}`);

        return res.status(200).json(posts);
    } catch (error) {
        console.error('findAllPosts error:', error);
        return res.status(500).json({ message: 'Internal error while fetching posts.' });
    }
}

async function findPostsByUserID(req, res) {
    try {
        const id = Number(req.params.id);
        const loggedInUserId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await userModel.findUserByID(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (id !== loggedInUserId && !user.IsPublicProfile) {
            const friendStatus = await friendsModel.getFriendStatus(loggedInUserId, id);
            if (friendStatus !== 'ACCEPTED') {
                return res.status(200).json([]);
            }
        }

        const posts = await postsModel.findPostsByUserId(id);

        if (posts.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(posts);

    } catch (error) {
        console.error('findPostByUserID error: ', error);
        return res.status(500).json({ message: 'Error finding post' });
    }
}

async function findPostByID(req, res) {
    try {
        const id = Number(req.params.id);
        const loggedInUserId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const post = await postsModel.findPostsById(id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.UserID !== loggedInUserId && !post.IsPublic) {
            const friendStatus = await friendsModel.getFriendStatus(loggedInUserId, post.UserID);
            if (friendStatus !== 'ACCEPTED') {
                return res.status(403).json({ message: 'Forbidden: This post is private' });
            }
        }

        return res.status(200).json(post);
    } catch (error) {
        console.error('findPostByID error: ', error);
        return res.status(500).json({ message: 'Error finding post' });
    }
}

async function addPost(req, res) {
    try {
        let { Content, IsPublic = 1 } = req.body;

        const UserID = req.user.userId;

        if (!Content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const post = await postsModel.addPost(UserID, Content, IsPublic);
        return res.status(201).json(post);

    } catch (error) {
        console.error('addPost error: ', error);
        return res.status(500).json({ message: 'Error adding post' });
    }
}

async function removePost(req, res) {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid post ID' });
        }

        const affectedRows = await postsModel.removePost(id, userId);

        if (affectedRows !== 1) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ message: 'Post removed successfully' });

    } catch (error) {
        console.error('removePost error: ', error);
        return res.status(500).json({ message: 'Error removing post' });
    }
}

async function editPost(req, res) {
    try {
        const id = Number(req.params.id);
        const userId = req.user.userId;

        if (!isValidId(id)) {
            return res.status(400).json({ message: 'Invalid Post ID' });
        }

        const { Content, IsPublic } = req.body;

        if (!Content || (IsPublic !== 0 && IsPublic !== 1)) {
            return res.status(400).json({ message: 'Missing arguments' });
        }

        const affectedRows = await postsModel.editPost(id, userId, Content, IsPublic);

        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found or no changes made' });
        }

        return res.status(200).json({ message: 'Post updated successfully' });

    } catch (error) {
        console.error('editPost error: ', error);
        return res.status(500).json({ message: 'Error updating post' });
    }
}

module.exports = { findAllPosts, findPostsByUserID, findPostByID, removePost, editPost, addPost };