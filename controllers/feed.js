"use strict";

module.exports = function (req, res) {
	res.render("feed", {
		user: req.user
	});
};
