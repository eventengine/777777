
"use strict";

var db = require('./../db');

/**
 * Проверка поля на уникальность.
 */
module.exports = function(value, tableName, fieldName) {
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
};