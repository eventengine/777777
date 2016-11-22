
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);



var sessionConfig = {
    store: {
		expiration: 86400000, // Максимальный срок жизни сессии; в миллисекундах.
		createDatabaseTable: true,
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'sid',
				expires: 'expires',
				data: 'data'
			}
		}
	},
    secret: "it:demo:secret",
    key: "sid",
    saveUninitialized: false,
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: null
    }
};

sessionConfig.store = Object.assign({}, sessionConfig.store, config.database);
sessionConfig.store = new MySQLStore(sessionConfig.store);

	
module.exports = session(sessionConfig);