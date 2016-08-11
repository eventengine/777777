
"use strict";

module.exports.get = function (req, res) {
	res.render("edit", {
		isProfileUpdated: false,
		user: req.user,
		userEditForm: req.user,
		errors: false
	});
};

module.exports.post = function (req, res, next) {
	var models = req.app.get("models");
	
	var newProfileData = {};
	
	// описание функции preValidation:
	// функция ищет пользователя с указанным id
	// и удаляет из req.body поля, которые совпали
	// с теми, которые уже есть в бд
	
	models.user.preValidation(req.user.id, req.body).then(function() {
		
		models.user.fieldNames.forEach(function(n) {
			newProfileData[n] = req[n in req.body ? "body" : "user"][n];
		});
		
		req.checkBody(models.user.getValidateSchema());
		
		req.asyncValidationErrors().then(function() {
			models.user.update(req.user.id, req.body).then(function(updatedUser) {
				req.logout();
				req.login(updatedUser, function(err) {
					if (err) return next(err);
					res.render("edit", {
						isProfileUpdated: true,
						user: req.user,
						userEditForm: newProfileData,
						errors: false
					});
				});
			});
		}).catch(function(errors) {
			res.render("edit", {
				isProfileUpdated: false,
				user: req.user,
				userEditForm: newProfileData,
				errors: errors
			});
		});
		
	});
	
};
