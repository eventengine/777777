
"use strict";

var db = require('../db');

var User = module.exports = {};

/**
 * Регистрация пользователя
 */
User.registrationUser = function(newUser) {
    // Шифрование пароля пользователя перед регистрацией
    newUser.salt = this.makeSalt();
    newUser.password = this.encryptPassword(newUser.password, newUser.salt);
    // процедура регистрации, путем составления SQL-запроса и отправка этого запроса в MySQL
    var fieldNames = [], values = [];
    this.fieldNames.forEach(function(fieldName) {
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