const friendsModel = require('../models/friendsModels');
const userModel = require('../models/usersModels');

const isValidId = (id) => Number.isInteger(id) && id >= 1;

async function addFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) {
            return res.status(400).json({ message: 'Invalid friend ID' });
        }
        if (userId === friendId) {
            return res.status(400).json({ message: 'You cannot add yourself as a friend' });
        }

        await friendsModel.addFriend(userId, friendId);
        return res.status(201).json({ message: 'Friend request sent' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error sending friend request' });
    }
}

async function acceptFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'Invalid friend ID' });

        const affectedRows = await friendsModel.acceptFriend(userId, friendId);
        if (affectedRows < 2) {
            return res.status(404).json({ message: 'Request not found or already accepted' });
        }

        return res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        return res.status(500).json({ message: 'Error accepting friend request' });
    }
}

async function removeFriend(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'Invalid friend ID' });

        const affectedRows = await friendsModel.removeFriend(userId, friendId);
        if (affectedRows < 2) {
            return res.status(404).json({ message: 'Relationship not found' });
        }

        return res.status(200).json({ message: 'Friend removed' });
    } catch (error) {
        return res.status(500).json({ message: 'Error removing friend' });
    }
}

async function getFriendStatus(req, res) {
    try {
        const userId = req.user.userId;
        const friendId = Number(req.params.friendId);

        if (!isValidId(friendId)) return res.status(400).json({ message: 'Invalid friend ID' });

        const status = await friendsModel.getFriendStatus(userId, friendId);
        return res.status(200).json({ status });
    } catch (error) {
        return res.status(500).json({ message: 'Error checking friend status' });
    }
}

async function findAllFriendsByUserID(req, res) {
    try {
        const userId = Number(req.params.id);
        const loggedInUserId = req.user.userId;
        
        if (!isValidId(userId)) return res.status(400).json({ message: 'Invalid user ID' });
        
        const user = await userModel.findUserByID(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (userId !== loggedInUserId && !user.IsPublicProfile) {
            const friendStatus = await friendsModel.getFriendStatus(loggedInUserId, userId);
            if (friendStatus !== 'ACCEPTED') {
                return res.status(200).json([]);
            }
        }

        const friends = await friendsModel.findAllFriendsByUserID(userId);
        return res.status(200).json(friends);
    } catch (error) {
        return res.status(500).json({ message: 'Error listing friends' });
    }
}

async function findPendingFriendsByUserID(req, res) {
    try {
        const userId = req.user.userId;
        const pending = await friendsModel.findPendingFriendsByUserID(userId);
        return res.status(200).json(pending);
    } catch (error) {
        return res.status(500).json({ message: 'Error listing pending requests' });
    }
}

async function findSentRequestsByUserID(req, res) {
    try {
        const userId = req.user.userId;
        const sent = await friendsModel.findSentRequestsByUserID(userId);
        return res.status(200).json(sent);
    } catch (error) {
        return res.status(500).json({ message: 'Error listing sent requests' });
    }
}

module.exports = {
    findAllFriendsByUserID,
    findPendingFriendsByUserID,
    findSentRequestsByUserID,
    acceptFriend,
    removeFriend,
    addFriend,
    getFriendStatus
};