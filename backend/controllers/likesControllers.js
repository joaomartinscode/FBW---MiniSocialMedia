const likesModel = require('../models/likesModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function toggleLike(req, res) {
    try {
        const { postId, commentId } = req.body;
        const userId = req.user.userId;

        if (!postId && !commentId) {
            return res.status(400).json({ message: 'Must provide a target: postId OR commentId' });
        }

        const targetId = postId || commentId;
        if (!isValidId(Number(targetId))) {
            return res.status(400).json({ message: 'Invalid target ID' });
        }

        const result = await likesModel.toggleLike(userId, postId, commentId);
        return res.status(200).json(result);

    } catch (error) {
        console.error('toggleLike error: ', error);
        return res.status(500).json({ message: 'Error processing like' });
    }
}

async function getLikes(req, res) {
    try {
        const postId = req.query.postId ? Number(req.query.postId) : null;
        const commentId = req.query.commentId ? Number(req.query.commentId) : null;
        const userId = req.user.userId; 

        if (!postId && !commentId) {
            return res.status(400).json({ message: 'Must query by at least one target' });
        }

        const result = await likesModel.getLikesCount(postId, commentId, userId);
        return res.status(200).json(result); 

    } catch (error) {
        console.error('getLikes error: ', error);
        return res.status(500).json({ message: 'Error fetching likes' });
    }
}

module.exports = { toggleLike, getLikes };