
/* global $ */

$(document).ready(function() {
    $('#birthdayDateDatepicker').datepicker({
        format: "yyyy-mm-dd",
        language: "ru",
        autoclose: true,
        todayHighlight: true
    });
});