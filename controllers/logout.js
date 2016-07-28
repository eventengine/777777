"use strict";

module.exports = function (req, res) {
	 res.clearCookie('remember_me');
	 req.logout();
	 res.redirect(req.query.redirect || '/');
};