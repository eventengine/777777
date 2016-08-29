"use strict";

module.exports = function (req, res) {
	res.render("invoice", {
		user: req.user
	});
};
