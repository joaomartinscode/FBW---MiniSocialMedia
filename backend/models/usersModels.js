let db = require('../config/db')

async function findAllUsers() {
    const [rows] = await db.query(
        `SELECT UserID, FullName, Birthdate, Email, IsPublicProfile
         FROM users`
    );
    return rows;
}

async function findUserByID(id) {
    const [rows] = await db.query('SELECT UserID, FullName, Birthdate, Email, IsPublicProfile\n' +
        'FROM users\n' +
        'WHERE UserID = ?', [id]);
    return rows[0] || null;
}

async function addUser(FullName, Email, Password, Birthdate) {
    const [rows] = await db.query(
        'INSERT INTO users (FullName, Email, Password, Birthdate) VALUES (?, ?, ?, ?)',
        [FullName, Email, Password, Birthdate]
    );
    return await findUserByID(rows.insertId);
}

async function removeUser(removedID){
    const [rows] = await db.query('Delete from users where UserID = ?', [removedID]);
    return rows.affectedRows;
}

async function editUser(UserID, FullName, Birthdate, Email, Password, IsPublicProfile){
    const [rows] = await db.query(
        'Update users SET FullName = ?, Birthdate = ?, Email= ?, Password = ?, IsPublicProfile = ? where UserID = ?',
        [FullName, Birthdate, Email, Password, IsPublicProfile, UserID]
    )
    return rows.affectedRows;
}

module.exports = {findAllUsers, findUserByID, addUser, editUser, removeUser}



