
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport'), 
	LocalStrategy = require('passport-local').Strategy,
	RememberMeStrategy = require('passport-remember-me').Strategy;
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var fs = require("fs");
var yaml = require("js-yaml");

Promise.resolve().then(function() {
	
	// Чтение конфигурационного файла нашей программы.
	// Файл будет разным на сервере разработки и на боевом сервере.
	// Если файл не будет найден, то будет предложено его заполнить.
	
	try {
		var config = fs.readFileSync(__dirname + "/config.yaml", "utf8");
		config = yaml.safeLoad(config);
	} catch(err) {
		throw Error("Ошибка, либо не найден config.yaml, либо он имеет ошибку YAML-формата.");
	}
	
	return config;
	
}).then(function(config) {
	
	// Настройка подключения к базе данных.
	// Передаем настройки БД из конфиг.файла в модуль models/db.js
	require("./models/db").configure(config.database);
	
	
	
	var app = express();
	
	// Сохраняем наш конфиг файл в приложении экспресса app
	app.locals.config = config;

	app.disable('x-powered-by');
	
	

	// - - - - - - - - - - - - - - - - - - - - -
	// блок базовых настроек // 
	// - - - - - - - - - - - - - - - - - - - - -
	app.set('views', path.join(__dirname,'views'));
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
	
	var RememberMeToken = {
		tokens: {},
		consume: function(token, fn) {
			var userId = this.tokens[token];
			delete this.tokens[token];
			return fn(null, userId);
		},
		save: function(token, userId, fn) {
			this.tokens[token] = userId;
			return fn();
		},
		generateToken: function(len) {
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var buf = [], charlen = chars.length;
			var getRandomInt = function(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};
			for (var i = 0; i < len; ++i) buf.push(chars[getRandomInt(0, charlen - 1)]);
			return buf.join('');
		} 
	};
	
	passport.use(new RememberMeStrategy(function(token, done) {
	    RememberMeToken.consume(token, function (err, userId) {
			if (err) return done(err);
			models.user.getUserById(userId).then(user => {
				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			});
	    });
	}, function(user, done) {
		var token = RememberMeToken.generateToken(64);
		RememberMeToken.save(token, user.id, function(err) {
			if (err) return done(err);
			return done(null, token);
		});
	}));

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
	app.use(passport.authenticate('remember-me'));


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
	app.post('/login', require("./controllers/login"), function(req, res, next) {
		// Issue a remember me cookie if the option was checked
		if (req.body.rememberme !== "true") return next();
		var token = RememberMeToken.generateToken(64);
		RememberMeToken.save(token, req.user.id, function(err) {
			if (err) return next(err);
			res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
			next();
		});
	}, function(req, res, next) {
		res.send({
			success: true,
			user: req.user
		});
	});
	app.post('/registration', require("./controllers/registration"));
	app.post('/passrestore', require("./controllers/passrestore"));

	//контроллеры обработки ошибок
	app.use(require("./controllers/404"));
	app.use(require("./controllers/500"));

	// Запуск веб-сервера.
	app.listen(app.locals.config.server.port, function () {
	  console.log('#c9io is on line. Port: ' + app.locals.config.server.port);
	});

    
    return app;
})

.catch(function(err) {
	console.log("Фатальная ошибка:");
	console.error(err);
});

