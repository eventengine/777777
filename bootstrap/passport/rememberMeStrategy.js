
var RememberMeStrategy = require('passport-remember-me').Strategy;

module.exports = new RememberMeStrategy(function(token, done) {
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
});