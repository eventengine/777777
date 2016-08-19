
"use strict";

var db = require('../db');

var User = module.exports = {};

/**
 * Получить количество пользователей.
 */
User.getCount = function() {
    return db.query('select count(*) as count from users').spread(function(rows) {
        return Number(rows[0].count);
    });
};

/**
 * Получение всех юзеров из бд
 */
User.getAllUsers = function() {
    return db.query('select * from users').spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователя по емейлу
 */
User.getUser = function(email) {
    return db.query('select * from users where email = ?', [email]).spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователя по ID
 */
User.getUserById = function(id) {
    id = isNaN(id) ? "nan" : id;
    return db.query('select * from users where id = ?', [id]).spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователя по имени
 */
User.getUserByFirstName = function(firstname) {
    return db.query('select * from users where firstname = ?', [firstname]).spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователя по фамилии
 */
User.getUserByLastName = function(lastname) {
    return db.query('select * from users where lastname = ?', [lastname]).spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователя по useruri
 */
User.getUserByUserUri = function(useruri) {
    return db.query('select * from users where useruri = ?', [useruri]).spread(function(rows) {
        return rows[0];
    });
};

/**
 * Получение пользователей по стране
 */
User.getUsersByCountry = function(country) {
    return db.query('select * from users where country = ?', [country]).spread(function(rows) {
        return rows;
    });
};

/**
 * Получение пользователей по городу
 */
User.getUsersByCity = function(city) {
    return db.query('select * from users where city = ?', [city]).spread(function(rows) {
        return rows;
    });
};