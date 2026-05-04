const postsModel = require('../models/postsModels');

async function findAllPosts(req, res) {
    try {
        const posts = await postsModel.findAllPosts();

        return res.status(200).json(posts);
    } catch (error) {
        console.error('findAllPosts error: ', error);
        return res.status(500).json({
            message: 'Error finding all posts'
        })
    }
}

async function findPostsByUserID(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({message: 'Invalid user ID'})
        }

        const posts = await postsModel.findPostsByUserId(id);

        if (posts.length === 0) {
            return res.status(404).json({
                message: 's'
            })
        }
        return res.status(200).json(posts);

    } catch (error) {

        console.error('findPostByUserID error: ', error)
        return res.status(500).json({
            message: 'Error finding post'
        });

    }
}

async function addPost(req, res) {
    try {

        let {UserID, Content, IsPublic = 1} = req.body;

        if (!Number.isInteger(UserID) || UserID < 1 || !Content) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const post = await postsModel.addPost(UserID, Content, IsPublic);

        return res.status(201).json(post);

    } catch
        (error) {
        console.error('addPost error: ', error)
        return res.status(500).json({
            message: 'Error adding post'
        })
    }
}


async function removePost(req, res) {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({message: 'Invalid post ID'})
        }
        const affectedRows = await postsModel.removePost(id);

        if (affectedRows !== 1) {
            return res.status(404).json({
                message: 'Post not found'
            })
        }
        return res.status(200).json({
            message: 'Post removed successfully'
        });

    } catch (error) {
        console.error('removePost error: ', error)
        return res.status(500).json({
            message: 'Error removing post'
        });
    }
}

async function editPost(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({message: 'Invalid Post ID'});
        }

        const {Content, IsPublic} = req.body;

        if (!Content || (IsPublic !== 0 && IsPublic !== 1)) {
            return res.status(400).json({
                message: 'Missing arguments'
            });
        }

        const affectedRows = await postsModel.editPost(id, Content, IsPublic);

        if (affectedRows === 0) {
            return res.status(404).json({message: 'Post not found or no changes made'});
        }

        return res.status(200).json({message: 'Post updated successfully'});

    } catch (error) {
        console.error('editPost error: ', error);
        return res.status(500).json({message: 'Error updating post'});
    }
}

module.exports = {findAllPosts, findPostsByUserID, removePost, editPost, addPost}