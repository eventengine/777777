"use strict";

module.exports = function (req, res) {
	res.render("achievement", {
		user: req.user
	});
};
