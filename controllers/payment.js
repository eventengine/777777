"use strict";

module.exports = function (req, res) {
	res.render("payment", {
		user: req.user
	});
};
