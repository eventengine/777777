"use strict";

var _ = require('lodash');
var nodemailer = require('nodemailer');

module.exports = function (req, res) {
	
	var config = req.app.locals.config;
	var models = req.app.get("models");
	
	models.user.getUser(req.body.email).then(user => {
		if (user) {
			models.user.generatePassword(user).then(function(password) {
			    var subject = "Password restore. Восстановление пароля";
			    var text = [];
			    text.push(subject);
			    text.push('Привет! :) Вот твой пароль, мы очень долго думали и придумали тебе новый:');
			    text.push(password);
			    text.push('С уважением, ваш Гдетус!');
			    var info = sendmail({
			        to: user.email,
			        subject: subject,
			        text: text.join("\n")
			    }, config);
			    console.log('Message sent: ' + info.response);
			    res.send({
			        success: true,
			        info: info
			    });
			});
		} else {
			res.send({
		        success: false,
		        message: "Пользователь с таким мэйлом не найден."
		    });
		}
	})
	.catch(function(err) {
	    console.log("Проблемы при отправке письма: ", err);
	    res.send({
	        success: false,
	        error: err
	    });
	});
    
};

function sendmail(mail, config) {
	var defaultMail = {
        from: 'fdfsdfdsffdsfsdfs@gmail.com'
    };
    mail = _.merge({}, defaultMail, mail);
	console.log("Отправляем письмо");
	console.log("Содержимое письма: ", mail);
	console.log("Настройки мэйлера: ", config.nodemailer);
	var transporter = nodemailer.createTransport(config.nodemailer);
	return new Promise(function(resolve, reject) {
        transporter.sendMail(mail, function(err, info) {
            if(err) return reject(err); else return resolve(info);
        });
	});
}