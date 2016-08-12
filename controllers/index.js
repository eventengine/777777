"use strict";

module.exports = function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect("/feed");
	} else {
		res.render('index');
	}
};
