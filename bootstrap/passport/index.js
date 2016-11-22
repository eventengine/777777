
var passport = require('passport');

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

