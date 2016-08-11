"use strict";

module.exports = function(req, res, next) {
    var models = req.app.get("models");
    
    
    
    //var newProfileData = {};
    
	//models.user.preValidation(req.user.id, req.body).then(function() {
		
		/*models.user.fieldNames.forEach(function(n) {
			newProfileData[n] = req[n in req.body ? "body" : "user"][n];
		});*/
		
		req.checkBody(models.user.getValidateSchema());
		
		req.asyncValidationErrors().then(function() {
			
            models.user.registrationUser(req.body)
			
            /*models.user.registrationUser({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                useruri: req.body.useruri,
                password: req.body.password,
                email: req.body.email
                // birthday_date: req.body.birthday_date
            })*/
            
            .then(function(result) {
                res.send(result);
            })
            
            .catch(function(err) {
                console.error("Ошибки при регистрации пользователя:");
                console.error(err);
            });
			
		}).catch(function(errors) {
		    res.send({
		        success: false,
		        errors: errors//,
		        //newProfileData: newProfileData
		    });
		});
		
	//});
    
};