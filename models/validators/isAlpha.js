
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAlpha;

var _assertString = require('validator/lib/util/assertString');

var _assertString2 = _interopRequireDefault(_assertString);

var _alpha = require('validator/lib/alpha');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAlpha(str, ...locales) {
  //var locale = arguments.length <= 1 || arguments[1] === undefined ? 'en-US' : arguments[1];
  locales = locales.length ? locales : ['en-US']

  (0, _assertString2.default)(str);
  //if (locale in _alpha.alpha) {
  if (locales.map(locale => locale in _alpha.alpha).reduce((a, b) => a && b)) {
    //return _alpha.alpha[locale].test(str);
    return locales.map(locale => _alpha.alpha[locale].test(str)).reduce((a, b) => a || b);
  }
  throw new Error('Invalid locale(s) \'' + locales.join('\', \'') + '\'');
}
module.exports = exports['default'];