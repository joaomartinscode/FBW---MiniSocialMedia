const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesControllers');

const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.post('/toggle', likesController.toggleLike);
router.get('/count', likesController.getLikes);

module.exports = router;