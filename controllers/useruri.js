"use strict";

module.exports = function (req, res, next) {
    
    var useruri = req.param("useruri");
    
    if (useruri) {
        
    	var models = req.app.get("models");
        
        //var path = req.path.replace(/^\//, "");
        //var useruri = path;
        var userid = null;
        
        var mode = "useruri";
        
        if (useruri.substr(0, 2).toLowerCase() == "id") {
            mode = "id";
            // id<что угодно> -> <что угодно>
            userid = Number(useruri.replace("id", ""));
        }
        
        var render = function(user) {
        	res.render("profile", {
        		user: req.user,
        		profileUser: user
        	});
        };
        
        switch (mode) {
            case "useruri":
    	        // <что угодно> ищем среди useruri
                models.user.getUserByUserUri(useruri).then(function(user) {
                    if (user) render(user); else next();
                });
                break;
            case "id":
            	// <что угодно> ищем среди id
            	models.user.getUserById(userid).then(function(user) {
            	    if (user) render(user); else next();
            	});
                break;
        }
        
        
        
        // некая функция для использования пользователем lock
        
        
        
    } else {
        next();
    }
    
    
    
};