
"use strict";

var db = require('../db');
var crypto = require('crypto');
var generatePassword = require("password-generator");

var User = module.exports = {};

User.changePassword = function(user, newPassword) {
    var salt = this.makeSalt();
    var password = this.encryptPassword(newPassword, salt);
    var sql = `update users set password = ?, salt = ? where id = ?`;
    return db.query(sql, [password, salt, user.id]).spread(function() {
        return user;
    });
};

/**
 * Функция генерации нового пароля.
 * Генерируется новый пароль, сохраняется в аккаунте пользователя, 
 * и возвращается в виде строки вызываемой функции.
 */
User.generatePassword = function(user) {
    var password = generatePassword(8, false);
    var salt = this.makeSalt();
    var encryptedPassword = this.encryptPassword(password, salt);
    return db.query(`
        update users 
        set salt = ?, password = ?
        where id = ?
    `, [salt, encryptedPassword, user.id]).spread(function() {
        return password;
    });
};

/**
 * Проверка правильности ввода пароля пользователя.
 */
User.checkPassword = function(user, password) {
    return this.encryptPassword(password, user.salt) === user.password;
};

/**
 * Шифрование пароля с солью.
 */
User.encryptPassword = function(password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex');
};

/**
 * Функция создания соли для шифрования паролей.
 */
User.makeSalt = function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
};