
"use strict";

/* global $, navigator */

navigator.geolocation.getCurrentPosition(function(location) {
    
    console.log("getCurrentPosition", location)
    
    $.get("/api/current-location", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
    });
});
