
"use strict";

module.exports = function(req, res) {
    var models = req.app.get("models");
    models.file.getFile(req.params.id).then(function(file) {
        if (file) {
            res.set("Content-Type", file.mime);
            res.send(file.content);
        } else {
            res.status(404).end();
        }
    });
};