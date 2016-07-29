"use strict";

module.exports = function (req, res) {
	res.render("achievements", {
		user: req.user
	});
};
