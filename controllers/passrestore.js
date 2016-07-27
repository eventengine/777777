"use strict";

var _ = require('lodash');
var nodemailer = require('nodemailer');

module.exports = function (req, res) {
	
	var config = req.app.locals.config;
	var models = req.app.get("models");
	
	models.user.getUser(req.body.email).then(user => {
	    var subject = "Восстановление пароля";
	    var text = [];
	    text.push(subject);
	    text.push(user.password);
	    return sendmail({
	        to: user.email,
	        subject: subject,
	        text: text.join("\n")
	    }, config);

	})
	.then(info => {
	    console.log('Message sent: ' + info.response);
	    res.send({
	        success: true,
	        info: info
	    });
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
        from: 'gdetusinfo@mail.ru', 
        to: 'gdetusinfo@mail.ru', 
        subject: 'Hello ', 
        text: 'Hello world'
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