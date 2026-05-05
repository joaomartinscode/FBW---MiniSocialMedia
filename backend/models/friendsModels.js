let db = require('../config/db')

async function findAllFriendsByUserID(userId) {
    const [rows] = await db.query(`
        SELECT 
            U.UserID AS FriendID, 
            U.FullName AS FriendName, 
            U.IsPublicProfile
        FROM FRIENDS F
        JOIN USERS U ON F.FriendID = U.UserID
        WHERE F.UserID = ? AND F.Status = 'ACCEPTED'`,
        [userId]
    );
    return rows;
}

async function findPendingFriendsByUserID(userId) {
    const [rows] = await db.query(`
        SELECT U.UserID, U.FullName, F.Status, F.CreatedAt 
        FROM FRIENDS F
        JOIN USERS U ON F.FriendID = U.UserID
        WHERE F.UserID = ? AND F.Status IN ('PENDING', 'REQUESTED')`,
        [userId]
    );
    return rows;
}

async function findSentRequestsByUserID(userId) {
    const [rows] = await db.query(`
        SELECT U.UserID AS FriendID, U.FullName, F.CreatedAt 
        FROM FRIENDS F
        JOIN USERS U ON F.FriendID = U.UserID
        WHERE F.UserID = ? AND F.Status = 'REQUESTED'`,
        [userId]
    );
    return rows;
}

async function getFriendStatus(userId, targetId) {
    const [rows] = await db.query(`
        SELECT Status FROM FRIENDS 
        WHERE UserID = ? AND FriendID = ?
    `, [userId, targetId]);

    return rows.length > 0 ? rows[0].Status : 'NONE';
}

async function addFriend(userIDSender, userIDReceiver) {
    const status = await getFriendStatus(userIDSender, userIDReceiver);

    if (status !== 'NONE') {
        throw new Error("Error adding friend");
    }

    await db.query(`INSERT INTO FRIENDS (UserID, FriendID, Status) VALUES (?, ?, 'REQUESTED')`, [userIDSender, userIDReceiver]);
    await db.query(`INSERT INTO FRIENDS (UserID, FriendID, Status) VALUES (?, ?, 'PENDING')`, [userIDReceiver, userIDSender]);
}

async function removeFriend(userId1, userId2) {
    const [result] = await db.query(`
        DELETE FROM FRIENDS
        WHERE (UserID = ? AND FriendID = ?)
           OR (UserID = ? AND FriendID = ?)
    `, [userId1, userId2, userId2, userId1]);

    return result.affectedRows;
}

async function acceptFriend(userId, friendId) {
    const [result] = await db.query(`
        UPDATE FRIENDS 
        SET Status = 'ACCEPTED' 
        WHERE (UserID = ? AND FriendID = ? AND Status = 'PENDING') 
           OR (UserID = ? AND FriendID = ? AND Status = 'REQUESTED')
    `, [userId, friendId, friendId, userId]);

    return result.affectedRows;
}

module.exports = {
    findAllFriendsByUserID,
    findPendingFriendsByUserID,
    findSentRequestsByUserID,
    getFriendStatus,
    removeFriend,
    acceptFriend,
    addFriend
}