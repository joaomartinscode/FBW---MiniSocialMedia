const commentsModel = require('../models/commentsModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function getCommentsByPostId(req, res) {
    try {
        const postId = Number(req.params.postId);
        if (!isValidId(postId)) return res.status(400).json({ message: 'Invalid Post ID' });

        const comments = await commentsModel.getCommentsByPostId(postId);
        return res.status(200).json(comments);
    } catch (error) {
        console.error('getComments error: ', error);
        return res.status(500).json({ message: 'Error fetching comments' });
    }
}

async function addComment(req, res) {
    try {
        const { postId, parentCommentId, content } = req.body;

        const userId = req.user.userId;

        if (!content) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if ((postId && parentCommentId) || (!postId && !parentCommentId)) {
            return res.status(400).json({ message: 'Must provide exactly one target: postId OR parentCommentId' });
        }

        const insertId = await commentsModel.addComment(userId, postId, parentCommentId, content);
        return res.status(201).json({ message: 'Comment added', commentId: insertId });
    } catch (error) {
        console.error('addComment error: ', error);
        return res.status(500).json({ message: 'Error adding comment' });
    }
}

async function removeComment(req, res) {
    try {
        const commentId = Number(req.params.id);
        const userId = req.user.userId;

        if (!isValidId(commentId)) return res.status(400).json({ message: 'Invalid Comment ID' });

        const affectedRows = await commentsModel.removeComment(commentId, userId);

        if (affectedRows === 0) {
            return res.status(403).json({ message: 'Comment not found or you do not have permission to delete it' });
        }

        return res.status(200).json({ message: 'Comment removed successfully' });
    } catch (error) {
        console.error('removeComment error: ', error);
        return res.status(500).json({ message: 'Error removing comment' });
    }
}

module.exports = { getCommentsByPostId, addComment, removeComment };