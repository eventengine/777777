
"use strict";

var Promise = require('bluebird');
var crypto = require('crypto');
var db = require('./db');
var generatePassword = require("password-generator");


var User = module.exports = {};

/**
 * Получить координаты всех пользователей.
 */
User.getLocations = function() {
    return db.query('select * from users where location_lon is not null').spread(function(rows) {
        var locations = [];
        rows.forEach(function(user) {
            locations.push({
                coord: [user.location_lat, user.location_lon],
                name: `${user.firstname} ${user.lastname}`,
                href: user.useruri ? `/${user.useruri}` : `/id${user.id}`
            });
        });
        return locations;
    });
};

/**
 * Сохранение текущих координат пользователя.
 */
User.setLocation = function(userId, location) {
    var sql = `update users set location_lat = ?, location_lon = ? where id = ?`;
    return db.query(sql, [location.lat, location.lon, userId]).spread(function() {
        return User.getUserById(userId);
    });
};


/**
 * Перечисление всех полей в профиле пользователя.
 */
User.fieldNames = ["firstname", "lastname", "useruri", "email", "birthday_date", "password", "salt", "location_lon", "location_lat"];

/**
 * Удаление полей формы, которые не изменены.
 * Не забывать в схеме для каждого поля прописывать optional: true.
 */
User.preValidation = function(userId, data) {
    return User.getUserById(userId).then(function(user) {
        for (var fieldname in data) {
            if (user[fieldname] == data[fieldname]) delete data[fieldname];
        }
    });
};

/**
 * Валидация полей профиля пользователя.
 */
User.getValidateSchema = function() {
    return {
        email: {
            optional: true,
            notEmpty: {
                errorMessage: "Поле с адресом почты не должно быть пустым."
            },
            isEmail: {
                errorMessage: "Адрес электронной почты написан с ошибкой или пустой."
            },
            isUnique: {
                options: ["users", "email"],
                errorMessage: "Почта с таким адресом уже существует."
            }
        },
        useruri: {
            optional: true,
            matches: {
                options: [/^[a-z0-9_\.]*$/],
                errorMessage: "Адрес может содержать ТОЛЬКО маленькие английские буквы, цифры, а также знаки подчёркивания и точки."
            },
            isLength: {
                options: [{ min: 4, max: 21, zeroEnable: true }],
                errorMessage: "Адрес должен быть длиной не менее 4-х и не более 21-го символа или пустым."
            },
            isUnique: {
                options: ["users", "useruri", true],
                errorMessage: "Аккаунт с таким адресом уже существует."
            },
            checkBlackList: {
                options: ["forbidden_useruri"],
                errorMessage: "Аккаунт с таким адресом зарезервирован."
            },
            isFirstLetter: {
                options: ["^_\."],
                errorMessage: "Первый символ адреса не точка и не подчёркивание."
            }
        },
        firstname: {
            optional: true,
            isAlpha: {
                options: ["ru-RU", "en-US"],
                errorMessage: "Имя может содержать только русские или латинские буквы."
            }
        },
        lastname: {
            optional: true,
            isAlpha: {
                options: ["ru-RU", "en-US"],
                errorMessage: "Фамилия может содержать только русские или латинские буквы."
            }
        },
        password: {
            optional: true,
            isLength: {
                options: [{ min: 8, zeroEnable: false }],
                errorMessage: "Пароль должен быть длиной не менее 8-и символов."
            },
            isGdetusPassword: {
                errorMessage: "латиница (большие маленькие), цифирица, спецсимволица. кирилицу низя!" 
            }
        }
    };
};

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
    // Шифрование пароля пользователя перед регистрацией
    newUser.salt = User.makeSalt();
    newUser.password = User.encryptPassword(newUser.password, newUser.salt);
    // процедура регистрации, путем составления SQL-запроса и отправка этого запроса в MySQL
    var fieldNames = [], values = [];
    User.fieldNames.forEach(function(fieldName) {
        fieldNames.push(fieldName);
        values.push(newUser[fieldName]);
    });
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
};