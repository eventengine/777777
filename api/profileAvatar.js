
"use strict";

// https://habrahabr.ru/post/229743/
// https://www.npmjs.com/package/multiparty
var multiparty = require('multiparty');

exports.create = function(req, res) {
    var form = new multiparty.Form();
    var models = req.app.get("models");
    form.parse(req, function(err, fields, files) {
        if (err) console.error(err);
        models.user.updateAvatar(req.user.id, files.avatar[0].path).then(function() {
            res.json({
                success: true
            });
        });
    });
};