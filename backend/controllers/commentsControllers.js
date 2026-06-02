const commentsModel = require('../models/commentsModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;


const formatComment = (c) => ({
    ...c,
    user: c.users,
    replies: c.other_comments ? c.other_comments.map(formatComment) : []
});

async function getCommentsByPostId(req, res) {
    try {
        const postId = Number(req.params.postId);
        if (!isValidId(postId)) return res.status(400).json({ message: 'Invalid Post ID' });

        const comments = await commentsModel.getCommentsByPostId(postId);
        const formatted = comments.map(formatComment);

        return res.status(200).json(formatted);
    } catch (error) {
        console.error('getComments error: ', error);
        return res.status(500).json({ message: 'Error fetching comments' });
    }
}

async function addComment(req, res) {
    try {
        const { postId, parentCommentId, content } = req.body;
        const userId = req.user.userId;

        if (!content) return res.status(400).json({ message: 'Missing content' });
        if (!postId && !parentCommentId) return res.status(400).json({ message: 'Missing target' });

        const insertId = await commentsModel.addComment(userId, postId, parentCommentId, content);
        return res.status(201).json({ message: 'Comment added', commentId: insertId });
    } catch (error) {
        console.error('addComment error: ', error);
        return res.status(500).json({ message: 'Error adding comment' });
    }
}

async function removeComment(req, res) {
    try {
        const commentId = Number(req.params.commentId);
        const userId = req.user.userId;
        const affectedRows = await commentsModel.removeComment(commentId, userId);
        if (affectedRows === 0) return res.status(403).json({ message: 'Denied' });
        return res.status(200).json({ message: 'Removed' });
    } catch (error) {
        return res.status(500).json({ message: 'Error' });
    }
}

module.exports = { getCommentsByPostId, addComment, removeComment };