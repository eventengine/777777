
"use strict";

var db = require('./../db');
var Promise = require('bluebird');

/**
 * Проверка поля на уникальность.
 */
module.exports = function(value, tableName, fieldName, skipIfEmpty) {
    
    if (skipIfEmpty && !value) {
        return Promise.resolve(true);
    } else {
        const sql = `
            select count(*) as count 
            from ${tableName} 
            where ${fieldName} = ?
        `;
        return db.query(sql, [value]).spread(function(rows) {
            return !!rows[0].count;
        }).then(function(found) {
            if (!found) return true; else throw new Error();
        });
    }
    
};