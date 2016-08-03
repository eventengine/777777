
"use strict";

var userModel = require('./user');

var Digits = module.exports = {};

Digits.getInfo = function() {
    var result = {};
    return userModel.getCount().then(function(count) {
        result.userCount = count;
        return result;
    });
};