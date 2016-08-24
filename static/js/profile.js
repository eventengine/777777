
/* global $ */

"use strict";

$(function() {
    
    setupUpload("Avatar", function(data) {
        updateSrc("profileAvatar");
        updateSrc("authProfileAvatar");
        notification("Ваш аватар обновлен!");
    });
    
    setupUpload("AvatarBackground", function(data) {
        var backgroundImage = $(".cover-photo").css("background-image");
        $(".cover-photo").css("background-image", backgroundImage.replace(/(url\(")(.*)("\))/, function(str, p1, p2, p3) {
            return `${p1}${p2}?${Math.random()}${p3}`;
        }));
        notification("Фон страницы обновлен!");
    });
    
});

function setupUpload(id, callback) {
    var upload = $("#upload" + id);
    var uploadInput = $("#upload" + id + "Input");
    
    upload.click(function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
        uploadInput.click();
        return false;
    });
    
    // https://www.npmjs.com/package/blueimp-file-upload
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Options
    uploadInput.fileupload({
        url: "/api/profile-avatar?fileType=" + id,
        dataType: "json",
        done: function(e, data) {
            callback(data);
        },
        fail: function() {
            console.error("Ошибки при загрузке файла", arguments);
        },
        dropZone: null
    });
}

function updateSrc(id) {
    var img = $("#" + id);
    var src = img.get(0).src + "?" + Math.random();
    img.removeAttr("data-src-retina data-src src");
    img.attr({
        "data-src-retina": src,
        "data-src": src,
        "src": src
    });
}

function notification(message) {
    var options = {
        position: "top-right",
        timeout: 0,
        type: "info",
        style: "flip",
        title: "Внимание!",
        message: message
    };
    $('body').pgNotification(options).show();
}

