const { prisma } = require('../lib/prisma');

/**
 * Determines the friendship status from the perspective of a given user (userId) towards another user (targetId).
 * - REQUESTED: userId has sent a request to targetId.
 * - PENDING: targetId has sent a request to userId (so userId has a pending request to accept).
 * - ACCEPTED: The friendship is accepted.
 * - NONE: No relationship exists.
 */
async function getFriendStatus(userId, targetId) {
    // Find the relationship record that represents the state from userId's perspective.
    // The database stores two records for each friendship request:
    // 1. (sender -> receiver) with status 'REQUESTED'
    // 2. (receiver -> sender) with status 'PENDING'
    const relation = await prisma.friends.findUnique({
        where: {
            // This uses the composite key defined in `schema.prisma` as @@id([UserID, FriendID])
            // Prisma's client generates the name `UserID_FriendID` for this key.
            UserID_FriendID: {
                UserID: parseInt(userId),
                FriendID: parseInt(targetId),
            },
        },
        select: {
            Status: true
        }
    });

    // If a record is found, its status is the status from userId's perspective.
    // If not found, there is no relationship from this perspective, so the status is 'NONE'.
    return relation ? relation.Status : 'NONE';
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
    // Check if a relationship already exists in either direction to prevent duplicates
    const existingRelation = await prisma.friends.findFirst({
        where: {
            OR: [
                { UserID: parseInt(userIDSender), FriendID: parseInt(userIDReceiver) },
                { UserID: parseInt(userIDReceiver), FriendID: parseInt(userIDSender) }
            ]
        }
    });

    if (existingRelation) {
        // If a relation already exists, we shouldn't create a new one.
        throw new Error("Relation already exists");
    }

    // Create two records to represent the relationship from both users' perspectives
    await prisma.friends.createMany({
        data: [
            { UserID: parseInt(userIDSender), FriendID: parseInt(userIDReceiver), Status: 'REQUESTED' },
            { UserID: parseInt(userIDReceiver), FriendID: parseInt(userIDSender), Status: 'PENDING' }
        ]
    });
}

async function removeFriend(userId1, userId2) {
    // Removes the relationship records in both directions
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
    // Updates the status to 'ACCEPTED' for the relationship in both directions
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

async function findAllFriendIds(userId) {
    const friends = await prisma.friends.findMany({
        where: {
            UserID: parseInt(userId),
            Status: 'ACCEPTED'
        },
        select: {
            FriendID: true
        }
    });

    return friends.map(f => f.FriendID);
}

module.exports = {
    findAllFriendsByUserID,
    findPendingFriendsByUserID,
    findSentRequestsByUserID,
    getFriendStatus,
    removeFriend,
    acceptFriend,
    addFriend,
    findAllFriendIds
};