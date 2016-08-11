
"use strict";

var fs = require('fs');
var _ = require('lodash');

/**
 * Проверка поля по черному списку.
 */
module.exports = function(value, listName) {
    return new Promise(function(resolve, reject) {
        fs.readFile(`${__dirname}/${listName}.txt`, "utf8", function(err, data) {
            if (err) reject(err); else resolve(data);
        });
    })
    .then(function(data) {
        var found = false;
        data = data.split("\n");
        data.forEach(function(forbiddenUseruri) {
            if (_.trim(forbiddenUseruri) && value.toLowerCase() == forbiddenUseruri.toLowerCase()) {
                found = true;
            }
        });
        return found;
    }).then(function(found) {
        if (!found) return true; else throw new Error();
    });
};