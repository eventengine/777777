
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
User.fieldNames = [
    "firstname",
    "nickname", 
    "lastname", 
    "useruri", 
    "email", 
    "password", 
    "salt", 
    "birthday_date",
    "birthday_date_muted", 
    "avatar_id", 
    "avatar_bg_id", 
    "location_lon", 
    "location_lat", 
    "chevron"
];

/**
 * Обновление данных пользователя.
 */
User.update = function(userId, data) {
    var fieldNames = User.fieldNames;
    
    var existsFieldNames = [];
    fieldNames.forEach(function(fieldName) {
        if (fieldName in data) existsFieldNames.push(fieldName);
    });
    
    // Checkboxes fields
    existsFieldNames.push("birthday_date_muted");
    
    var setStatement = existsFieldNames.map(function(fieldName) {
        return `${fieldName} = ?`;
    }).join(", ");
    
    var values = [];
    existsFieldNames.forEach(function(fieldName) {
        var value = data[fieldName];
        if (fieldName == "birthday_date") {
            value = new Date(value);
            value = isNaN(value.getFullYear()) ? null : value;
        }
        if (fieldName == "birthday_date_muted") value = value == "on" ? 1 : 0;
        values.push(value);
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
 * Обновление аватара и фона на странице пользователя.
 */
User.updateFile = function(userId, fileType, filepath) {
    var fileIdFieldName = { Avatar: "avatar_id", AvatarBackground: "avatar_bg_id" }[fileType];
    return db.query("select ?? as file_id from users where id = ?", [fileIdFieldName, userId]).spread(rows => {
        return rows[0]["file_id"];
    }).then(fileId => {
        if (fileId) {
            return File.update(fileId, filepath);
        } else {
            return File.insert(filepath).then(fileId => {
                return db.query("update users set ?? = ? where id = ?", [fileIdFieldName, fileId, userId]);
            });
        }
    });
};
