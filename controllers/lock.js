"use strict";

module.exports = function (req, res) {
	res.render("lock", {
		user: req.user
	});
};
