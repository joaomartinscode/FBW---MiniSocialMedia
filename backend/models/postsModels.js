let db = require('../config/db')

async function findAllPosts() {
    const [rows] = await db.query(`
        SELECT PostID, UserID, Content, IsPublic, CreatedAt
        FROM posts
        ORDER BY CreatedAt DESC
    `);
    return rows;
}

async function findPostsByUserId(id) {
    const [rows] = await db.query(`
        SELECT PostID, UserID, Content, IsPublic, CreatedAt 
        FROM posts 
        WHERE UserID = ?
    `, [id]);

    return rows[0] || null;
}
async function findPostsById(id) {
    const [rows] = await db.query(`
        SELECT PostID, UserID, Content, IsPublic, CreatedAt 
        FROM posts 
        WHERE PostID = ?
    `, [id]);

    return rows[0] || null;
}

async function addPost(UserID, Content, isPublic) {
    const [rows] = await db.query(
        'INSERT INTO posts (UserID, Content, isPublic) VALUES (?, ?, ?)',
        [UserID, Content, isPublic]
    );
    return await findPostsById(rows.insertId);
}

async function removePost(removedID){
    const [rows] = await db.query('Delete from posts where PostID = ?', [removedID]);
    return rows.affectedRows;
}

async function editPost(editedPostID, newContent, newIsPublic){
    const [rows] = await db.query(
        'Update posts SET Content = ?, IsPublic = ? where PostID = ?',
        [newContent, newIsPublic, editedPostID]
    )
    return rows.affectedRows;
}

module.exports = {findAllPosts, findPostsByUserId, addPost, removePost, editPost}



