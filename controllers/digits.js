
"use strict";

module.exports = function (req, res) {
    
    var models = req.app.get("models");
    
    models.digits.getInfo().then(function(info) {
        res.send({
            success: true,
            info: info
        });
    });
    
};