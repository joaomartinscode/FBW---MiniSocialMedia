const express = require('express');
const router = express.Router();
const {findAllPosts, findPostsByUserID, removePost, editPost, addPost} = require('../controllers/postsControllers')


router.get('/', findAllPosts);

router.get('/:id', findPostsByUserID);

router.post('/', addPost);

router.put('/:id', editPost);

router.delete('/:id', removePost);

module.exports = router;