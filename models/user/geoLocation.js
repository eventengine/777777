
"use strict";

var db = require('../db');

var User = module.exports = {};

/**
 * Получение координат всех пользователей.
 */
User.getLocations = function() {
    return db.query('select * from users where location_lon is not null').spread(function(rows) {
        var locations = [];
        rows.forEach(function(user) {
            locations.push({
                avatarSrc: user.avatar_id ? `/file/${user.avatar_id}` : "/assets/img/profiles/avatar.jpg",
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
    var User = this;
    var sql = `update users set location_lat = ?, location_lon = ? where id = ?`;
    return db.query(sql, [location.lat, location.lon, userId]).spread(function() {
        return User.getUserById(userId);
    });
};