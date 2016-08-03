"use strict";

module.exports = function (req, res, next) {
    
	var models = req.app.get("models");
	
    // http://site.ru/id<что угодно>
    // http://site.ru/<что угодно>
    
    var path = req.path.replace(/^\//, "");
    var useruri = path;
    var userid = null;
    
    var mode = "useruri";
    
    if (path.substr(0, 2).toLowerCase() == "id") {
        mode = "id";
        // id<что угодно> -> <что угодно>
        userid = Number(path.replace("id", ""));
    }
    
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
    
    function render(user) {
    	res.render("profile", {
    		user: req.user,
    		profileUser: user
    	});
    }
    
    // некая функция для использрвания пользователем lock
    
};