
"use strict";

/**
 * Ресурс для сохранения текущих координат пользователя.
 */

exports.index = function(req, res){
    
    
    if (req.isAuthenticated()) {
        var models = req.app.get("models");
        
        models.user.setLocation(req.user.id, {
            lat: req.query.latitude,
            lon: req.query.longitude
        }).then(function() {
            res.json({
                success: true
            });
        });
        
        
    } else {
        res.json({
            success: true
        });
    }
    
    

};