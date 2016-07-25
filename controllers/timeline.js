"use strict";

module.exports = function (req, res) {
	res.render("timeline", {
		user: req.user
	});
};
