const friendsModel = require('../models/friendsModels');

async function findAllFriendsByUserID(req, res) {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const friends = await friendsModel.findAllFriendsByUserID(userId);

        return res.status(200).json(friends);
    } catch (error) {
        console.error('findAllFriendsByUserID error: ', error);
        return res.status(500).json({
            message: 'Error listing all friends of user'
        });
    }
}

async function findPendingFriendsByUserID(req, res) {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const pendingFriends = await friendsModel.findPendingFriendsByUserID(userId);

        return res.status(200).json(pendingFriends);
    } catch (error) {
        console.error('findPendingFriendsByUserID error: ', error);
        return res.status(500).json({
            message: 'Error listing all pending friends of user'
        });
    }
}

async function findSentRequestsByUserID(req, res) {
    try {
        const userId = Number(req.params.id);

        if (!Number.isInteger(userId) || userId < 1) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const sentFriends = await friendsModel.findSentRequestsByUserID(userId);

        return res.status(200).json(sentFriends);
    } catch (error) {
        console.error('findSentRequestsByUserID error: ', error);
        return res.status(500).json({
            message: 'Error listing all sent friends of user'
        });
    }
}

async function acceptFriend(req, res) {
    try {
        const userId = Number(req.params.id);
        const { friendId } = req.body;

        if (!Number.isInteger(userId) || userId < 1 || !Number.isInteger(friendId) || friendId < 1) {
            return res.status(400).json({ message: 'Invalid userId or friendId' });
        }

        const affectedRows = await friendsModel.acceptFriend(userId, friendId);

        if (affectedRows < 2) {
            return res.status(404).json({ message: 'Friend request not found or already accepted' });
        }

        return res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error('acceptFriend error: ', error);
        return res.status(500).json({ message: 'Error accepting friend' });
    }
}

async function removeFriend(req, res) {
    try {
        const userId = Number(req.params.id);
        const { friendId } = req.body;

        if (!Number.isInteger(userId) || userId < 1 || !Number.isInteger(friendId) || friendId < 1) {
            return res.status(400).json({ message: 'Invalid userId or friendId' });
        }

        const affectedRows = await friendsModel.removeFriend(userId, friendId);

        if (affectedRows < 2) {
            return res.status(404).json({ message: 'User or friendship not found' });
        }

        return res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error('removeFriend error: ', error);
        return res.status(500).json({ message: 'Error removing friend' });
    }
}

async function addFriend(req, res) {
    try {
        const userId = Number(req.params.id);
        const { friendId } = req.body;

        if (!Number.isInteger(userId) || userId < 1 || !Number.isInteger(friendId) || friendId < 1) {
            return res.status(400).json({ message: 'Invalid userId or friendId' });
        }

        if (userId === friendId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        await friendsModel.addFriend(userId, friendId);

        return res.status(201).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('addFriend error: ', error);
        return res.status(500).json({ message: 'Error adding friend' });
    }
}

async function getFriendStatus(req, res) {
    try {
        const userId = Number(req.params.id);
        const { friendId } = req.body;

        if (!Number.isInteger(userId) || userId < 1 || !Number.isInteger(friendId) || friendId < 1) {
            return res.status(400).json({ message: 'Invalid userId or friendId' });
        }

        const status = await friendsModel.getFriendStatus(userId, friendId);

        return res.status(200).json({ status });
    } catch (error) {
        console.error('getFriendStatus error: ', error);
        return res.status(500).json({ message: 'Error fetching friend status' });
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