
"use strict";

var fs = require('fs');
var path = require('path');
var mime = require('mime');
var db = require('./db');

var File = module.exports = {};

/**
 * Вспомогательная функция загрузки файла в буфер.
 * @return Promise (Buffer)
 */
function loadFile(filepath) {
    return new Promise(function(resolve, reject) {
        fs.open(filepath, "r", function(status, fd) {
            if (status) reject(status); else resolve(fd);
        });
    }).then(function(fd) {
        return new Promise(function(resolve, reject) {
            var filesize = fs.statSync(filepath).size;
            var buffer = new Buffer(filesize);
            fs.read(fd, buffer, 0, filesize, 0, function(err, num) {
                if (err) reject(err); else resolve(buffer);
            });
        });
    });
}

File.getFile = function(id) {
    return db.query(`select * from files where id = ?`, [id]).spread(function(rows) {
        return rows[0] ? {
            content: rows[0].content,
            ext: rows[0].ext,
            mime: mime.lookup(rows[0].ext)
        } : null;
    });
};

File.insert = function(filepath) {
    return loadFile(filepath).then(function(buffer) {
        var ext = path.extname(filepath);
        var sql = `insert into files set content = ?, ext = ?`;
        return db.query(sql, [buffer, ext]).spread(function(result) {
            return result.insertId;
        });
    });
};

File.update = function(id, filepath) {
    return loadFile(filepath).then(function(buffer) {
        var ext = path.extname(filepath);
        var sql = `update files set content = ?, ext = ? where id = ?`;
        return db.query(sql, [buffer, ext, id]).spread(function() {
            return;
        });
    });
};

File.delete = function(id) {
    
};