"use strict";

module.exports = function (req, res) {
	res.render("map", {
		user: req.user
	});
};
