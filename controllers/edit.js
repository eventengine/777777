"use strict";

module.exports = function (req, res) {
	res.render("edit", {
		user: req.user
	});
};
