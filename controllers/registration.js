"use strict";

module.exports = function(req, res) {
    var models = req.app.get("models");
    
    models.user.registrationUser({
        firstName: req.param("firstName"),
        lastName: req.param("lastName"),
        useruri: req.param("useruri"),
        password: req.param("password"),
        email: req.param("email")
    })
    
    .then(function(result) {
        res.send(result);
    })
    
    .catch(function(err) {
        console.error("Ошибки при регистрации пользователя:")
        console.error(err);
    });
    
};