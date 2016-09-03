
"use strict";

var express = require("express");
var router = express.Router();

module.exports = router;

/**
 * Контроллер вывода страницы с данными профиля пользователя.
 */
router.get("/", function (req, res) {
	res.render("edit", {
		isProfileUpdated: false,
		user: req.user,
		userEditForm: req.user,
		errors: false
	});
});

/**
 * Контроллер смены пароля.
 */
router.post("/", function (req, res, next) {
	if (req.body.formName != "change-password") return next();
	var models = req.app.get("models");
	req.checkBody(models.user.getPasswordValidateSchema(req));
	req.asyncValidationErrors().then(function() {
		// изменение старого пароля на новый
		models.user.changePassword(req.user, req.body.newPassword).then(function() {
			res.render("edit", {
				isProfileUpdated: "Ваш пароль изменен на новый.",
				user: req.user,
				userEditForm: req.user,
				errors: false
			});
		});
	}).catch(function(errors) {
		res.render("edit", {
			isProfileUpdated: false,
			user: req.user,
			userEditForm: req.user,
			errors: errors
		});
	});
});

/**
 * Контроллер обновления данных профиля пользователя.
 */
router.post("/", function (req, res, next) {
	if (req.body.formName != "user-profile") return next();
	
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
	
});
