
"use strict";

var User = module.exports = {};

/**
 * Удаление полей формы, которые не изменены.
 * Не забывать в схеме для каждого поля прописывать optional: true.
 */
User.preValidation = function(userId, data) {
    return this.getUserById(userId).then(function(user) {
        for (var fieldname in data) {
            if (user[fieldname] == data[fieldname]) delete data[fieldname];
        }
    });
};

User.getPasswordValidator = function(fieldName = "Поле пароль") {
    return {
        optional: true,
        notEmpty: {
            errorMessage: `${fieldName} не должно быть пустым.`
        },
        isLength: {
            options: [{ min: 8, zeroEnable: false }],
            errorMessage: `${fieldName} должен быть длиной не менее 8-и символов.`
        },
        isGdetusPassword: {
            errorMessage: `${fieldName} должно содержать латиница (большие маленькие), цифирица, спецсимволица.` 
        }
    };
};

/**
 * Валидация полей формы смены пароля.
 */
User.getPasswordValidateSchema = function(req) {
    return {
        oldPassword: {
            optional: true,
            isValidPassword: {
                options: [req],
                errorMessage: "Вы неправильно ввели старый пароль."
            }
        },
        newPassword: this.getPasswordValidator("Поле новый пароль"),
        repeatNewPassword: Object.assign({}, this.getPasswordValidator(), {
            isValidRepeatedPassword: {
                options: [req],
                errorMessage: "Повтор пароля не совпадает со значением поля Новый пароль."
            }
        })
    };
};

/**
 * Валидация полей формы изменения личных данных пользователя.
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
                options: ["^\."],
                errorMessage: "Первым символом адреса не может быть точка."
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
        password: this.getPasswordValidator()
    };
};