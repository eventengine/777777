"use strict";

module.exports.get = function (req, res) {
	res.render("edit", {
		isProfileUpdated: false,
		user: req.user
	});
};

module.exports.post = function (req, res, next) {
	var models = req.app.get("models");
	models.user.update(req.user.id, req.body).then(function(updatedUser) {
		req.logout();
		req.login(updatedUser, function(err) {
			if (err) return next(err);
			res.render("edit", {
				isProfileUpdated: true,
				user: req.user
			});
		});
	});
};
