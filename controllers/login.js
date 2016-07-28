"use strict";

var passport = require("passport");

module.exports = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return next(err);
		if (user) {
			req.login(user, function(err) {
				if (err) return next(err);
				// Успешно вошли.
				/*res.send({
					success: true,
					user: user
				});*/
				next();
			});
		}
		if (!user) {
			// Проблемы со входом.
			res.send({
				success: false,
				message: info.message,
				info: info
			});
		}
	})(req, res, next);
};