
/**
 * Зависимости 
 */


var path = require('path');

var vhost = require('vhost');
var express = require('express');
require('express-resource');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');

var passport = require('passport');
require('./passport');

/**
 * Приложение Express.
 */


module.exports = function(config) {
	


	
	var app = express();
	
	// Подключение нескольких тестовых статичных сайтов или поддоменов.
	var apps = {
		beta: express(),
		m: express(),
		mail: express(),
		player: express()
	};
	for (var key in apps) {
		apps[key].use(express.static(__dirname + '/subdomains/' + key));
		app.use(vhost(key + '.gdetus.io', apps[key]));
		app.use(`/subdomain/${key}`, apps[key]); // для тестирования субдомена на сервере разработки
	}
	
	
	// Сохраняем наш конфиг файл в приложении экспресса app
	app.locals.config = config;
	var databaseConfig = app.locals.config.database;
	
	app.disable('x-powered-by');
	
	// - - - - - - - - - - - - - - - - - - - - -
	// блок базовых настроек // 
	// - - - - - - - - - - - - - - - - - - - - -
	app.set('views', path.join(__dirname,'views'));
	app.set('view engine','ejs');
	
	// определение моделей пользователя из архитектуры mvc
	var models = require("./models");
	app.set('models', models);
	
	
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	
	
	// Редирект на https
	app.use(function(req, res, next) {
		if (app.locals.config.https && req.protocol === "http") {
			res.redirect(`https://${req.hostname}${req.originalUrl}`);
		} else {
			next();
		}
	});
	
	
	
	
	app.use(expressValidator({
		customValidators: require("./models/validators")
	}));
	
	
	
	// подключаем методы инициализации пользователя и его сессии
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(passport.authenticate('remember-me'));
	
	
	app.use(require("./middlewares/session"));
	
	
	// - - - - - - - - - - - - - - -//
	// конец блока базовых настроек //
	// - - - - - - - - - - - - - - -//
	
	
	//блок подключения статики и файлов
	app.use(express.static(__dirname + '/static'));
	app.use("/blueimp-file-upload", express.static(path.dirname(require.resolve("blueimp-file-upload/package.json"))));
	
	//блок подключения ресурсов (rest)API
	var api = express();
	api.resource('user-locations', require('./api/userLocations'));
	api.resource('current-location', require('./api/currentLocation'));
	api.resource('profile-avatar', require('./api/profileAvatar'));
	app.use("/api", api);
	
	
	//блок подключения основных контроллеров
	app.get('/file/:id', require("./controllers/file"));
	app.get('/im', require("./controllers/im"));
	app.get('/map', require("./controllers/map"));
	app.get('/digits', require("./controllers/digits"));
	app.use('/edit', require("./controllers/edit"));
	app.get('/lock', require("./controllers/lock"));
	app.get('/feed', require("./controllers/feed"));
	app.get('/payment', require("./controllers/payment"));
	app.get('/invoice', require("./controllers/invoice"));
	app.get('/settings', require("./controllers/settings"));
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
	
	//блок подключения завершающих контроллеров
	app.get('/:useruri', require("./controllers/useruri"));
	app.get('/', require("./controllers/index"));
	
	
	//контроллеры обработки ошибок
	app.use(require("./controllers/404"));
	app.use(require("./controllers/500"));
	
	return app;

};