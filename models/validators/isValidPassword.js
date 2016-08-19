
"use strict";

/**
 * Проверка поля с паролем:
 * Пароль должен совпасть с паролем авторизованного пользователя.
 */
module.exports = function(value, req) {
    var models = req.app.get("models");
    return models.user.checkPassword(req.user, value);
};