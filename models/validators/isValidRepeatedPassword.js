
"use strict";

/**
 * Проверка поля с повтором ввода пароля:
 * Повтор должен совпасть со значением поля Новый пароль (newPassword).
 */
module.exports = function(value, req) {
    return req.body.newPassword == req.body.repeatNewPassword;
};