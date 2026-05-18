const { prisma } = require('../lib/prisma');

async function getFriendStatus(userId, targetId) {
    const friendRelation = await prisma.friends.findUnique({
        where: {
            UserID_FriendID: {
                UserID: parseInt(userId),
                FriendID: parseInt(targetId)
            }
        },
        select: {
            Status: true
        }
    });

    return friendRelation ? friendRelation.Status : 'NONE';
}

async function findAllFriendsByUserID(userId) {
    const friends = await prisma.friends.findMany({
        where: {
            UserID: parseInt(userId),
            Status: 'ACCEPTED'
        },
        include: {
            users_friends_FriendIDTousers: {
                select: {
                    UserID: true,
                    FullName: true,
                    IsPublicProfile: true
                }
            }
        }
    });

    return friends.map(f => ({
        FriendID: f.users_friends_FriendIDTousers.UserID,
        FriendName: f.users_friends_FriendIDTousers.FullName,
        IsPublicProfile: f.users_friends_FriendIDTousers.IsPublicProfile
    }));
}

async function findPendingFriendsByUserID(userId) {
    const pending = await prisma.friends.findMany({
        where: {
            UserID: parseInt(userId),
            Status: 'PENDING'
        },
        include: {
            users_friends_FriendIDTousers: {
                select: {
                    UserID: true,
                    FullName: true,
                    IsPublicProfile: true
                }
            }
        }
    });

    return pending.map(f => ({
        UserID: f.users_friends_FriendIDTousers.UserID,
        FullName: f.users_friends_FriendIDTousers.FullName,
        Status: f.Status,
        CreatedAt: f.CreatedAt
    }));
}

async function findSentRequestsByUserID(userId) {
    const sent = await prisma.friends.findMany({
        where: {
            UserID: parseInt(userId),
            Status: 'REQUESTED'
        },
        include: {
            users_friends_FriendIDTousers: {
                select: {
                    UserID: true,
                    FullName: true
                }
            }
        }
    });

    return sent.map(f => ({
        FriendID: f.users_friends_FriendIDTousers.UserID,
        FullName: f.users_friends_FriendIDTousers.FullName,
        CreatedAt: f.CreatedAt
    }));
}

async function addFriend(userIDSender, userIDReceiver) {
    const status = await getFriendStatus(userIDSender, userIDReceiver);

    if (status !== 'NONE') {
        throw new Error("Relation already exists");
    }

    await prisma.friends.createMany({
        data: [
            { UserID: parseInt(userIDSender), FriendID: parseInt(userIDReceiver), Status: 'REQUESTED' },
            { UserID: parseInt(userIDReceiver), FriendID: parseInt(userIDSender), Status: 'PENDING' }
        ]
    });
}

async function removeFriend(userId1, userId2) {
    const result = await prisma.friends.deleteMany({
        where: {
            OR: [
                { UserID: parseInt(userId1), FriendID: parseInt(userId2) },
                { UserID: parseInt(userId2), FriendID: parseInt(userId1) }
            ]
        }
    });

    return result.count;
}

async function acceptFriend(userId, friendId) {
    const result = await prisma.friends.updateMany({
        where: {
            OR: [
                { UserID: parseInt(userId), FriendID: parseInt(friendId) },
                { UserID: parseInt(friendId), FriendID: parseInt(userId) }
            ]
        },
        data: {
            Status: 'ACCEPTED'
        }
    });

    return result.count;
}

module.exports = {
    findAllFriendsByUserID,
    findPendingFriendsByUserID,
    findSentRequestsByUserID,
    getFriendStatus,
    removeFriend,
    acceptFriend,
    addFriend
};