"use strict";

module.exports = function (req, res) {
	res.render("im", {
		user: req.user
	});
};
