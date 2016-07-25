"use strict";

var Promise = require("bluebird");
var db = require('./db');

var User = module.exports = {};

/**
 * Получение всех юзеров из бд
 */
User.getAllUsers = function() {
    return db.query('select * from users');
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
 * Регистрация пользователя
 */
User.registrationUser = function(config) {
    var result = Promise.resolve()
    
    .then(function() {
        var errors = [];
        if (!config.firstName) errors.push("Не заполнено поле Имя.");
        if (!config.lastName) errors.push("Не заполнено поле Фамилия.");
        if (!config.password) errors.push("Не заполнено поле Пароль.");
        if (!config.email) errors.push("Не заполнено поле Почта.");
        return errors;
    })
    
    .then(function(errors) {
        if (config.email) {
            return db.query("select count(*) as count from users where email = ?", [config.email])
            .spread(function(rows) {
                return !!rows[0].count;
            })
            .then(function(emailExists) {
                if (emailExists) errors.push("Аккаунт с почтой " + config.email + " уже зарегистрирован.");
                return errors;
            });
        } else {
            return errors;
        }
    })
	
	.then(function(errors) {
        if (config.useruri) {
            return db.query("select count(*) as count from users where useruri = ?", [config.useruri])
            .spread(function(rows) {
                return !!rows[0].count;
            })
            .then(function(useruriExists) {
                if (emailExists) errors.push("Аккаунт с адресом " + config.useruri + " уже зарегистрирован.");
                return errors;
            });
        } else {
            return errors;
        }
    })
	
    
    .then(function(errors) {
        if (errors.length) {
            return {
                success: false,
                message: "Ошибки при регистрации пользователя: " + errors.join(" ")
            };
        } else {
            var fieldNames = [], values = [];
            for (var fieldName in config) {
                fieldNames.push(fieldName);
                values.push(config[fieldName]);
            }
            return db.query(`
                insert into users (${fieldNames.join(", ")}) 
                values (${fieldNames.map(i => "?").join(", ")})
            `, values)
            .spread(function(rows) {
                console.log("Зарегистрирован пользователь");
                console.log("ID нового пользователя: " + rows[0].insertId);
                console.log("Количество записей: " + rows[0].affectedRows);
                return;
            })
            .then(function() {
                return {
                    success: true,
                    message: "Пользователь успешно зарегистрирован!"
                };
            });
        }
    });
    
    return result;
};