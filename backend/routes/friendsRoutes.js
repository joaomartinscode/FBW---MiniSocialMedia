const express = require('express');
const router = express.Router();
const {findAllFriendsByUserID, findPendingFriendsByUserID, findSentRequestsByUserID, acceptFriend, removeFriend, addFriend, getFriendStatus} = require('../controllers/friendsControllers')

router.get('/:id', findAllFriendsByUserID);
router.get('/:id/pending', findPendingFriendsByUserID);
router.get('/:id/sent', findSentRequestsByUserID);

router.post('/:id/add', addFriend);
router.put('/:id/accept', acceptFriend);
router.delete('/:id/remove', removeFriend);
router.get('/:id/status', getFriendStatus);

module.exports = router;
