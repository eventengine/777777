
"use strict";

var Promise = require('bluebird');

var fs = require('fs');
var path = require('path');
var db = require('../db');
var File = require('../file');

var User = module.exports = {};
Object.assign(User, require("./validation"));
Object.assign(User, require("./password"));
Object.assign(User, require("./geoLocation"));
Object.assign(User, require("./registration"));
Object.assign(User, require("./get"));

/**
 * Перечисление всех полей в профиле пользователя.
 */
User.fieldNames = ["firstname", "lastname", "useruri", "email", "birthday_date", 
    "password", "salt", "location_lon", "location_lat", "avatar", "avatar_ext", "avatar_bg", "avatar_bg_ext"];

/**
 * Обновление данных пользователя.
 */
User.update = function(userId, data) {
    var fieldNames = User.fieldNames;
    
    var existsFieldNames = [];
    fieldNames.forEach(function(fieldName) {
        if (fieldName in data) existsFieldNames.push(fieldName);
    });
    
    var setStatement = existsFieldNames.map(function(fieldName) {
        return `${fieldName} = ?`;
    }).join(", ");
    
    var values = [];
    existsFieldNames.forEach(function(fieldName) {
        values.push(data[fieldName]);
    });
    values.push(userId);
    
    if (setStatement) {
        return db.query(`update users set ${setStatement} where id = ?`, values).spread(function() {
            return User.getUserById(userId);
        });
    } else {
        return User.getUserById(userId);
    }
};

/**
 * Обновление аватара пользователя.
 */
User.updateAvatar = function(userId, filepath) {
    return db.query("select avatar_id from users where id = ?", [userId]).spread(rows => {
        return rows[0]["avatar_id"];
    }).then(avatarId => {
        if (avatarId) {
            return File.update(avatarId, filepath);
        } else {
            return File.insert(filepath).then(avatarId => {
                return db.query("update users set avatar_id = ? where id = ?", [avatarId, userId]);
            });
        }
    });
};

/**
 * Получить аватар пользователя.
 */
User.getAvatar = function(userId) {
    return db.query(`select avatar_id from users where id = ?`, [userId]).spread(function(rows) {
        return File.getFile(rows[0].avatar_id);
    });
};