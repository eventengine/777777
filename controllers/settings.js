"use strict";

module.exports = function (req, res) {
	res.render("settings", {
		user: req.user
	});
};
