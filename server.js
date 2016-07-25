
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

Promise.resolve().then(function() {
	var app = express();	

	app.disable('x-powered-by');
	
	

	// - - - - - - - - - - - - - - - - - - - - -
	// блок базовых настроек // 
	// - - - - - - - - - - - - - - - - - - - - -
	app.set('views',path.join(__dirname,'views'));
	app.set('view engine','ejs');
	app.set('trust proxy', 1) // trust first proxy

	app.use(cookieParser());
	
	
	
    return app;
}).then(function(app) {
	
	
	
	return new Promise(function (resolve, reject) {
		require("./models/db").pool.getConnection(function (err, connection) {
			if (err) {
			 if (connection) connection.release();
			 reject(err);
			}
			resolve(connection)
			
		});
	})

	.then(function(connection) {
		
		
		
		var sessionStoreConfig = {
			expiration: 86400000, // The maximum age of a valid session; milliseconds.
			createDatabaseTable: true,
			schema: {
				tableName: 'sessions',
				columnNames: {
					session_id: 'sid',
					expires: 'expires',
					data: 'data'
				}
			}
		};
		var sessionStore = new MySQLStore(sessionStoreConfig, connection);
		return sessionStore;
	})

	.then(function(sessionStore) {
		return {
			app: app,
			sessionStore: sessionStore
		}
	});
    
}).then(function(result) {
    var app = result.app, sessionStore = result.sessionStore;
    
    app.use(session({
        store: sessionStore,
        secret: "it:demo:secret",
        key: "sid",
        cookie: {
            "path": "/",
            "httpOnly": true,
            "maxAge": null
        }
    }));
    
    return app;
}).then(function(app) {
    // определение моделей пользователя из архитектуры mvc
	var models = {
		user: require("./models/user")
	};

	app.set('models', models);
	app.use(bodyParser.urlencoded({ extended: true }));

	// настройка стратегии аутентификации пользователя в сервисе
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done){
		models.user.getUser(email).then(function(user) {
			if (user) {
				if (user.password == password) {
					done(null, user);
				} else {
					done(null, false, { message: 'Incorrect password.' });
				}
			} else {
				done(null, false, { message: 'Incorrect username.' });
			}
		}).catch(function(err) {
			done(err);
		});
	}));

	// определяем функцию сериализации пользователя
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	// определяем функцию ДЕсериализации пользователя
	passport.deserializeUser(function(user, done) {
	  models.user.getUserById(user.id).then(function(user) {
		done(null,user);
	  }).catch(function(err) {
		done(err);
	  });
	});

	// подключаем методы инициализации пользователя и его сессии
	app.use(passport.initialize());
	app.use(passport.session());


	// - - - - - - - - - - - - - - - - - - - - -
	// конец блока базовых настроек //
	// - - - - - - - - - - - - - - - - - - - - -

	//require('./models/user').getAllUsers().spread(function(rows) {
	//	console.log('We got some muthafuckaz!!!', rows);
	//});


	//блок подключения статики и файлов
	app.use(express.static(__dirname + '/static'));

	//блок подключения основных контроллеров
	app.get('/', require("./controllers/index"));
	app.get('/im', require("./controllers/im"));
	app.get('/test', require("./controllers/test"));
	app.get('/map', require("./controllers/map"));
	app.get('/edit', require("./controllers/edit"));
	app.get('/lock', require("./controllers/lock"));
	app.get('/feed', require("./controllers/feed"));
	app.get('/logout', require("./controllers/logout"));
	app.get('/profile', require("./controllers/profile"));
	app.get('/timeline', require("./controllers/timeline"));
	app.get('/achievements', require("./controllers/achievements"));
	app.post('/login', require("./controllers/login"));
	app.post('/registration', require("./controllers/registration"));




	//контроллеры обработки ошибок
	app.use(require("./controllers/404"));
	app.use(require("./controllers/500"));

	//назначение порта
	app.listen(8080, function () {
	  console.log('#c9io is on line. Port: 8080');
	});

    
    return app;
})

.catch(function(err) {
	console.log("Фатальная ошибка:");
	console.error(err);
});




