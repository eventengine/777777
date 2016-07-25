"use strict";

module.exports = function (req, res) {
	 req.logout();
	 res.redirect(req.query.redirect || '/');
};