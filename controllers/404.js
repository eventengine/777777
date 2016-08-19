"use strict";

module.exports = function (req, res, next) {
  var err = new Error("Not f*cking found, блеять!");
 //err.status = 404;
 //next(err);
 res.status(404).render('404');
};