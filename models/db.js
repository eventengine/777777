var db = require('mysql-promise')();

db.configure({
	"host": "141.8.194.121",
	"user": "root",
	"password": "36hd8zcbn9```777",
	"database": "gdetus"
});

module.exports = db;