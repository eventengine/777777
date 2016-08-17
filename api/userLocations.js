
"use strict";

exports.index = function(req, res){
  
    if (req.isAuthenticated()) {
        var models = req.app.get("models");
        
        models.user.getLocations().then(function(locations) {
            res.json({
                success: true,
                locations: locations
            });
        });
        
        
    } else {
        res.json({
            success: false
        });
    }
  
  
};