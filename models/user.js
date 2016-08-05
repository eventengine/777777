"use strict";

var crypto = require('crypto');
var Promise = require("bluebird");
var db = require('./db');
var generatePassword = require("password-generator");

var User = module.exports = {};

/**
 * Обновление данных пользователя.
 */
User.update = function(userId, data) {
    var fieldNames = ["firstname", "lastname", "useruri", "email", "birthday_date"];
    
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
    
    return db.query(`update users set ${setStatement} where id = ?`, values).spread(function() {
        return User.getUserById(userId);
    });
};

/**
 * Функция генерации нового пароля.
 * Генерируется новый пароль, сохраняется в аккаунте пользователя, 
 * и возвращается в виде строки вызываемой функции.
 */
User.generatePassword = function(user) {
    var password = generatePassword(8, false);
    var salt = User.makeSalt();
    var encryptedPassword = User.encryptPassword(password, salt);
    return db.query(`
        update users 
        set salt = ?, password = ?
        where id = ?
    `, [salt, encryptedPassword, user.id]).spread(function() {
        return password;
    });
};

/**
 * Получить количество пользователей.
 */
User.getCount = function() {
    return db.query('select count(*) as count from users').spread(function(rows) {
        return Number(rows[0].count);
    });
};

/**
 * Проверка правильности ввода пароля пользователя.
 */
User.checkPassword = function(user, password) {
    return User.encryptPassword(password, user.salt) === user.password;
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


/**
 * Регистрация пользователя
 */
User.registrationUser = function(newUser) {
    var result = Promise.resolve()
    
    .then(function() {
        var errors = [];
        // Проверяем заполненность трех полей:
        if (!newUser.firstName) errors.push("Не заполнено поле Имя.");
        if (!newUser.lastName) errors.push("Не заполнено поле Фамилия.");
        if (!newUser.password) errors.push("Не заполнено поле Пароль.");
        return errors;
    })
    
    .then(function(errors) {
        // Если у нового пользователя поле Почта заполнена, то
        if (newUser.email) {
            // то ищем пользователей с такой почтой (у нас регистрация с существующей почтой запрещена руководством свыше)
            return db.query("select count(*) as count from users where email = ?", [newUser.email])
            .spread(function(rows) {
                // Конвертируем количество найденных записей в переменную булевского типа, 
                // то бишь, если записей больше нуля, переменная равна true, иначе false.
                return !!rows[0].count;
            })
            .then(function(emailExists) {
                // уведомление для пользователя о том что такой емейл уже использован
                if (emailExists) errors.push("Аккаунт с почтой " + newUser.email + " уже зарегистрирован.");
                return errors;
            });
        } else {
            errors.push("Не заполнено поле Почта.");
            return errors;
        }
    })
	
	.then(function(errors) {
        if (newUser.useruri) {
            return db.query("select count(*) as count from users where useruri = ?", [newUser.useruri])
            .spread(function(rows) {
                return !!rows[0].count;
            })
            .then(function(useruriExists) {
                if (useruriExists) errors.push("Аккаунт с адресом " + newUser.useruri + " уже зарегистрирован или зарезервирован.");
                return errors;
            });
        } else {
            return errors;
        }
    })
	
    .then(function(errors) {
        // Если имеются ошибки
        if (errors.length) {
            // то возвращаем браузеру сообщение об ошибках.
            return {
                success: false,
                message: "Ошибки при регистрации пользователя: " + errors.join(" "),
                errors: errors
            };
        // иначе регистрируем нового пользователя
        } else {
            // Шифрование пароля пользователя перед регистрацией
            newUser.salt = User.makeSalt();
            newUser.password = User.encryptPassword(newUser.password, newUser.salt);
            // процедура регистрации, путем составления SQL-запроса и отправка этого запроса в MySQL
            var fieldNames = [], values = [];
            for (var fieldName in newUser) {
                fieldNames.push(fieldName);
                values.push(newUser[fieldName]);
            }
            return db.query(`
                insert into users (${fieldNames.join(", ")}) 
                values (${fieldNames.map(i => "?").join(", ")})
            `, values)
            // После регистрации в консоль сервера выводим отладочные сообщения
            .spread(function(rows) {
                console.log("Зарегистрирован пользователь");
                console.log("ID нового пользователя: " + rows.insertId);
                console.log("Количество записей: " + rows.affectedRows);
                return;
            })
            // А браузеру сообщаем об успехе
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