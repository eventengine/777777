
/* global $ */

$(function() {
    
    var uploadAvatar = $("#uploadAvatar");
    var uploadAvatarInput = $("#uploadAvatarInput");
    
    uploadAvatar.click(function() {
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
        uploadAvatarInput.click();
        return false;
    });
    
    // https://www.npmjs.com/package/blueimp-file-upload
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Basic-plugin
    // https://github.com/blueimp/jQuery-File-Upload/wiki/Options
    uploadAvatarInput.fileupload({
        url: "/api/profile-avatar",
        dataType: "json",
        done: function(e, data) {
            console.log("Загрузка завершена", data);
        },
        fail: function() {
            console.error("Ошибки при загрузке файла", arguments);
        },
        progressall: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            console.log(progress);
        },
        dropZone: $(document)
    });
    
});