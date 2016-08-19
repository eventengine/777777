
"use strict";

var Promise = require('bluebird');

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

