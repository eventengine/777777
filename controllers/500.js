"use strict";

module.exports = function (req, res, next) {
  var err = new Error("Братюнь, наш сервир опять напился :((");
 err.status = 500;
 //next(err);
 res.render('500');
};