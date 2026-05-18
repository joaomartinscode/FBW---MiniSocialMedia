const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsControllers');

const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/post/:postId', commentsController.getCommentsByPostId);
router.post('/', commentsController.addComment);
router.delete('/:commentid', commentsController.removeComment);

module.exports = router;