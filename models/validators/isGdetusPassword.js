
"use strict";

/**
 * Проверка поля пароля на требования.
 */
module.exports = function(value) {
    
    // Набор правил
    // Имена ключей в этом объекте могут быть любыми
    // Они для лучшего понимания частей итогового регулярного выражения
    var patterns = {
      'numeric':     '0-9',
      'special':     '!@#$%^&\'"*:\\[\\]{}~`+№\\-=;,|\\\\/.<>?',
      'latin_lower': 'a-z',
      'latin_upper': 'A-Z'
    };

    return makePasswordRegExp(patterns, 1, 1000).test(value);
    
};

function makePasswordRegExp(patterns, min, max) {
  min = min || ''; // Если минимальное число символов не указано, берём пустую строку
  max = max || ''; // Если максимальное число символов не указано, берём пустую строку
  var regex_string = '';
  var rules = [];
  var range = "{" + min + "," + max + "}"; // Разрешённый диапазон для длины строки
  for (var rule in patterns) { // Обрабатываем входящий массив из ВСЕХ правил для строки
    if (patterns.hasOwnProperty(rule)) {
      rules.push(patterns[rule]); // Запоминаем правила
      // Формируем последовательность из шаблонов `(?=.*[%s])`
      // Она проверит обязательное присутствие всех символов из входящего набора
      regex_string += "(?=.*[" + patterns[rule] + "])";
    }
  }
  // Добавляем в хвост набор из ВСЕХ разрешённых символов и разрешённую длину строки
  regex_string += "[" + rules.join('') + "]" + range;
  // Собираем всё в одно регулярное выражение
  return new RegExp(regex_string, 'g');
}

