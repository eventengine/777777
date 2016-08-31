
"use strict";

/* global $, navigator */

/**
 * Отправка текущих координат авторизованного пользователя на сервер для отслеживания.
 */

navigator.geolocation.getCurrentPosition(function(location) {
    $.get("/api/current-location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
    });
});



