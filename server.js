

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
var program = require('commander');

program
  .version('0.0.1')
  .option('-c, --config [file]', 'Конфигурационный файл приложения.')
  .parse(process.argv);


Promise.resolve().then(function() {
	
	// Чтение конфигурационного файла нашей программы.
	// Файл будет разным на сервере разработки и на боевом сервере.
	// Если файл не будет найден, то будет предложено его заполнить.
	
	var pathToConfig = program.config ? program.config : __dirname + "/config.yaml";
	
	try {
		var config = fs.readFileSync(pathToConfig, "utf8");
	} catch(err) {
		throw Error("Ошибка, не найден config.yaml. " + err.message);
	}
	
	try {
		config = yaml.safeLoad(config);
	} catch(err) {
		throw Error("Ошибка, config.yaml он имеет ошибку YAML-формата. " + err.message);
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
		};
		var sessionStore = new MySQLStore(sessionStoreConfig, connection);
		return sessionStore;
	})

	.then(function(sessionStore) {
		return {
			app: app,
			sessionStore: sessionStore
		};
	});
    
}).then(function(result) {
    var app = result.app, sessionStore = result.sessionStore;
    
    app.use(session({
        store: sessionStore,
        secret: "it:demo:secret",
        key: "sid",
        saveUninitialized: false,
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
		user: require("./models/user"),
		digits: require("./models/digits"),
		tokensRememberMe: require("./models/tokensRememberMe")
	};

	app.set('models', models);
	app.use(bodyParser.urlencoded({ extended: true }));
	
	// Настройка стратегии RememberMeStrategy модуля passport для кнопки "Запомнить меня" 
	passport.use(new RememberMeStrategy(function(token, done) {
	    models.tokensRememberMe.consume(token).then(function(userId) {
			models.user.getUserById(userId).then(function(user) {
				if (user) done(null, user); else done(null, false);
			});
	    })
	    .catch(function(err) {
	    	done(err);
	    });
	}, function(user, done) {
		var token = models.tokensRememberMe.generateToken();
		models.tokensRememberMe.save(token, user.id).then(function() {
			done(null, token);
		})
	    .catch(function(err) {
	    	done(err);
	    });
	}));

	// настройка стратегии аутентификации пользователя в сервисе
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done){
		models.user.getUser(email).then(function(user) {
			if (user) {
				if (models.user.checkPassword(user, password)) {
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
	  	if (user) done(null, user); else throw Error(`passport.deserializeUser: Пользователь с номером ${user.id} не найден.`);
	  }).catch(function(err) {
		done(err);
	  });
	});

	// подключаем методы инициализации пользователя и его сессии
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(passport.authenticate('remember-me'));


	// - - - - - - - - - - - - - - -//
	// конец блока базовых настроек //
	// - - - - - - - - - - - - - - -//


	//блок подключения статики и файлов
	app.use(express.static(__dirname + '/static'));

	//блок подключения основных контроллеров
	app.get('*', require("./controllers/useruri"));
	app.get('/', require("./controllers/index"));
	app.get('/im', require("./controllers/im"));
	app.get('/test', require("./controllers/test"));
	app.get('/map', require("./controllers/map"));
	app.get('/digits', require("./controllers/digits"));
	app.get('/edit', require("./controllers/edit").get);
	app.post('/edit', require("./controllers/edit").post);
	app.get('/lock', require("./controllers/lock"));
	app.get('/feed', require("./controllers/feed"));
	app.get('/payment', require("./controllers/payment"));
	app.get('/logout', require("./controllers/logout"));
	app.get('/profile', require("./controllers/profile"));
	app.get('/timeline', require("./controllers/timeline"));
	app.get('/achievements', require("./controllers/achievements"));
	app.post('/registration', require("./controllers/registration"));
	app.post('/passrestore', require("./controllers/passrestore"));
	app.post('/login', require("./controllers/login"), function(req, res, next) {
		// Issue a remember me cookie if the option was checked
		if (req.body.rememberme !== "true") return next();
		var token = models.tokensRememberMe.generateToken();
		models.tokensRememberMe.save(token, req.user.id).then(function() {
			res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
			next();
		}).catch(function(err) {
			next(err);
		});
	}, function(req, res, next) {
		res.send({
			success: true,
			user: req.user
		});
	});

	//контроллеры обработки ошибок
	app.use(require("./controllers/404"));
	app.use(require("./controllers/500"));

	// Запуск веб-сервера.
	var server = app.listen(app.locals.config.server.port, function () {
	  console.log('#c9io is on line. Port: ' + app.locals.config.server.port);
	});
	
	function getBind(addr) {
		if (!addr) return "<not address>";
		if (typeof addr === "string") return `Pipe ${addr}`;
		switch (addr.family) {
			case "IPv6": return `[${addr.address}]:${addr.port}`;
			case "IPv4": return `${addr.address}:${addr.port}`;
		}
	}
	
	server.on("error", err => {
		if (err.syscall == "listen") {
			var bind = getBind(server.address());
			console.error("Внимание, сервер не запущен.");
			console.error({
				EACCES: `Адрес ${bind} требует повышенных привилегий.`,
				EADDRINUSE: `Адрес ${bind} уже используется.`
			}[err.code] || "Неизвестная ошибка.");
			console.error(err);
		}
	});

    
    return app;
})

.catch(function(err) {
	console.error("Фатальная ошибка:");
	console.error(err);
});

