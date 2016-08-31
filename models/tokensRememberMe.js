"use strict";

var uuid = require('node-uuid');
var Promise = require("bluebird");
var db = require('./db');

var TokensRememberMe = module.exports = {};

/**
 * Функция сохранения токена и ID пользователя
 */
TokensRememberMe.save = function(token, userId) {
    return db.query(`
        insert into tokens_remember_me (token, user_id) 
        values (?, ?)
    `, [token, userId]).spread(function(result) {
        return result;
    });
};

/**
 * Функция восстановления номера пользователя по его токену
 */
TokensRememberMe.consume = function(token) {
    return db.query(`
        select user_id as userId from tokens_remember_me
        where token = ?
    `, [token]).spread(function(result) {
        var user = result[0];
        if (user) {
            var userId = user.userId;
            return db.query("delete from tokens_remember_me where token = ?", [token]).spread(function(result) {
                return userId;
            });
        } else {
            Promise.resolve(null);
        }
    });
};

/**
 * Генерация токена
 */
TokensRememberMe.generateToken = function(len) {
	return uuid.v1();
};