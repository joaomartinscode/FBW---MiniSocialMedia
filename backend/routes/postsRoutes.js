const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsControllers')

const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', postsController.findAllPosts);

router.get('/user/:id', postsController.findPostsByUserID);

router.post('/', postsController.addPost);

router.put('/:id', postsController.editPost);

router.delete('/:id', postsController.removePost);

module.exports = router;