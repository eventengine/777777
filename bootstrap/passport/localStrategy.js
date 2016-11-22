
var LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
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
})