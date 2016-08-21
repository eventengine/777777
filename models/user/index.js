
"use strict";

var Promise = require('bluebird');

var fs = require('fs');
var path = require('path');
var db = require('../db');

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
    "password", "salt", "location_lon", "location_lat"];

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
User.updateAvatar = function(userId, avatar) {
    var filepath = avatar;
    return new Promise(function(resolve, reject) {
        fs.open(filepath, "r", function(status, fd) {
            if (status) reject(status); else resolve(fd);
        });
    }).then(function(fd) {
        return new Promise(function(resolve, reject) {
            var filesize = fs.statSync(filepath).size;
            var buffer = new Buffer(filesize);
            fs.read(fd, buffer, 0, filesize, 0, function(err, num) {
                if (err) reject(err); else resolve(buffer);
            });
        });
    }).then(function(buffer) {
        
        var ext = path.extname(filepath);
        
        var sql = `update users set avatar = ?, avatar_ext = ? where id = ?`;
        return db.query(sql, [buffer, ext, userId]).spread(function() {
            return;
        });
    });
};

/**
 * Получить аватар пользователя.
 */
User.getAvatar = function(userId) {
    return db.query(`select avatar, avatar_ext from users where id = ?`, [userId]).spread(function(rows) {
        return rows[0].avatar && rows[0].avatar_ext ? {
            file: rows[0].avatar,
            ext: rows[0].avatar_ext
        } : null;
    });
};