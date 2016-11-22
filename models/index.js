
// определение моделей пользователя из архитектуры mvc
var models = {
	file: require("./file"),
	user: require("./user"),
	digits: require("./digits"),
	tokensRememberMe: require("./tokensRememberMe")
};

module.exports = models;