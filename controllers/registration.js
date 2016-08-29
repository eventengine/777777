
"use strict";

module.exports = function(req, res, next) {
    var models = req.app.get("models");
    req.checkBody(models.user.getValidateSchema());
	req.asyncValidationErrors().then(function() {
        models.user.registrationUser(req.body).then(function(result) {
            res.send(result);
        }).catch(function(err) {
            console.error("Ошибки при регистрации пользователя:");
            console.error(err);
        });
	}).catch(function(err) {
	    res.send({
	        success: false,
	        errors: err
	    });
	});
};