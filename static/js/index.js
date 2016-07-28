
/* global $ */

$(function() {
    
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
        var firstName = $("#accreq [name='firstName']").val();
        var lastName = $("#accreq [name='lastName']").val();
        var useruri = $("#accreq [name='useraddr']").val();
        var password = $("#accreq [name='password']").val();
        var email = $("#accreq [name='email']").val();
        $.post("/registration", {
            firstName: firstName,
            lastName: lastName,
            useruri: useruri,
            password: password,
            email: email
        })
        .done(function(data, textStatus) {
            if (data.success) {
                alert("Регистрация произведена успешно!");
                $('#accreq').modal('hide');
            } else {
                alert(data.message);
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