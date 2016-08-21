
"use strict";

// https://habrahabr.ru/post/229743/
// https://www.npmjs.com/package/multiparty
var multiparty = require('multiparty');
var mime = require('mime');
var path = require('path');

exports.index = function(req, res) {
    var models = req.app.get("models");
    models.user.getAvatar(req.query.id || req.user.id).then(function(avatar) {
        if (avatar) {
            res.set("Content-Type", mime.lookup(avatar.ext));
            res.send(avatar.file);
        } else {
            res.sendFile(path.normalize(__dirname + "/../static/assets/img/profiles/avatar.jpg"));
        }
    });
};

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