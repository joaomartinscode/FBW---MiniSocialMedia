let mysql = require('mysql2/promise')

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'fbw',
});

module.exports = pool;
