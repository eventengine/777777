module.exports = function(req, res) {
    
    res.send("Текущий паспорт:" + req.user);
    console.log(req.user);
    
};