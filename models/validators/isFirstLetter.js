
"use strict";

/**
 * Проверка первого символа. 
 * Используй ^ в шаблоне, если нужно обратить правило.
 */
module.exports = function(value, pattern) {
    return new RegExp(`[${pattern}]`).test(value[0]);
};