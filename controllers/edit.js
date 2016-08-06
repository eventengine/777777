"use strict";

module.exports.get = function (req, res) {
	res.render("edit", {
		isProfileUpdated: false,
		user: req.user,
		errors: false
	});
};

module.exports.post = function (req, res, next) {
	var models = req.app.get("models");
	
	req.checkBody(models.user.getValidateSchema());
	var errors = req.validationErrors();
	
	if (errors) {
		res.render("edit", {
			isProfileUpdated: false,
			user: req.user,
			errors: errors
		});
	} else {
		models.user.update(req.user.id, req.body).then(function(updatedUser) {
			req.logout();
			req.login(updatedUser, function(err) {
				if (err) return next(err);
				res.render("edit", {
					isProfileUpdated: true,
					user: req.user,
					errors: false
				});
			});
		});
	}
	
};
