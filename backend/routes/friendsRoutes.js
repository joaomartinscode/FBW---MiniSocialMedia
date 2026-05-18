const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsControllers');

const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/:id', friendsController.findAllFriendsByUserID);
router.get('/:id/pending', friendsController.findPendingFriendsByUserID);
router.get('/:id/sent', friendsController.findSentRequestsByUserID);

router.get('/:id/status/:friendId', friendsController.getFriendStatus);
router.post('/:id/add/:friendId', friendsController.addFriend);
router.put('/:id/accept/:friendId', friendsController.acceptFriend);
router.delete('/:id/remove/:friendId', friendsController.removeFriend);

module.exports = router;