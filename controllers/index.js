"use strict";

module.exports = function (req, res) {
	
	
	console.log("INDEX")
	
	
	if (req.isAuthenticated()) {
		res.redirect("/feed");
	} else {
		res.render('index');
	}
};
