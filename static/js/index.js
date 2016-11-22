
/* global $ */

$(function() {
    
    function notificationInfo(selector, message) {
        $(selector).pgNotification($.extend({}, {
            position: "top-right",
            timeout: 0,
            type: "info",
            style: "flip",
            title: "Внимание!"
        }, {
            message: message
        })).show();
    }
    
    /**
     * Запрос количественных параметров, необходимых для страницы быстрой статистики /digits.
     */
     
    $.get("/digits").done(function(data, textStatus) {
        if (data.success) {
            $("#digits h1[name='userCount']").text(data.info.userCount);
        } else {
            console.error("Ошибка при запросе количественных параметров, необходимых для страницы быстрой статистики /digits.");
        }
    }).fail(function() {
        console.error("Ошибка при запросе количественных параметров, необходимых для страницы быстрой статистики /digits.");
        console.error(arguments);
    });
    
    /**
     * Обработчик формы авторизации пользователя.
     */
    $("#form-login").submit(function() {
        var login = $("#form-login [name='login']").val();
        var password = $("#form-login [name='password']").val();
        var rememberme = $("#form-login #rememberme").get(0).checked;
        if ($.trim(login) && $.trim(password)) {
            $.post("/login", {
                email: login,
                password: password,
                rememberme: rememberme
            })
            .done(function(data, textStatus) {
                if (data.success) {
                    document.location = '/feed';
                } else {
                    alert("Введен неправильный логин или пароль.");
                }
            })
            .fail(function() {
                alert("Ошибка при отправке формы. См. подробности в консоли браузера.");
                console.error("Ошибка при отправке формы авторизации пользователя.");
                console.error(arguments);
            });
        }
        return false;
    });
    
    
    /**
     * Обработчик формы регистрации пользователя.
     */
    $("#accreq button[type='submit']").click(function() {
        var firstname = $("#accreq [name='firstname']").val();
        var lastname = $("#accreq [name='lastname']").val();
        var useruri = $("#accreq [name='useraddr']").val();
        var password = $("#accreq [name='password']").val();
        var email = $("#accreq [name='email']").val();
        $.post("/registration", {
            firstname: firstname,
            lastname: lastname,
            useruri: useruri,
            password: password,
            email: email
        })
        .done(function(data, textStatus) {
            if (data.success) {
                $('#accreq').modal('hide');
                notificationInfo(".bg-pic", "Регистрация произведена успешно!");
            } else {
                var message = [];
                message.push("<b>Внимание, ошибк" + (data.errors.length == 1 ? "а" : "и") + " при регистрации пользователя:</b>");
                data.errors.forEach(function(error) {
                    message.push("<li>" + (error.value ? "<b>" + error.value + ": " + "</b>" : "") + error.msg + "</li>");
                });
                notificationInfo("#accreq", message.join("\n"));
            }
        })
        .fail(function() {
            alert("Ошибка при отправке формы. См. подробности в консоли браузера.");
            console.error("Ошибка при отправке формы авторизации пользователя.");
            console.error(arguments);
        });
        return false;
    });
    
    /**
     * Обработка чекбокса Акцепт формы регистрации.
     */
    $("#accreq #regaccepted").change(function() {
        if (this.checked) {
            $("#accreq button[type='submit']").removeAttr("disabled");
        } else {
            $("#accreq button[type='submit']").attr("disabled", "disabled");
        }
    });
    
    /**
     * Обработчик формы восстановления пароля пользователя.
     */
    $("#restore button[type='submit']").click(function() {
        var email = $("#restore [name='email']").val();
        
        $.post("/passrestore", {
            email: email
        })
        .done(function(data, textStatus) {
            if (data.success) {
                alert("Письмо для восстановления пароля отправлено успешно!");
                console.log("Письмо для восстановления пароля отправлено успешно!");
                console.log(data);
                $('#restore').modal('hide');
            } else {
                alert(data.message);
            }
        })
        .fail(function() {
            alert("Ошибка при отправке формы. См. подробности в консоли браузера.");
            console.error("Ошибка при отправке письма для восстановления пароля.");
            console.error(arguments);
        });
        return false; 
    });
    
});