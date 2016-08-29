
"use strict";

/* global $, DG */

var map;

DG.then(function() {
	map = DG.map('map', {
		'center': [54.98, 82.89],
		'zoom': 13,
		'preferCanvas': true,
		'fullscreenControl': false,
		'zoomControl': true,
		'trackResize':	true,
		'geoclicker':	true,
		'watch': true,
		'setView': true,
		'poi': true,
	
	});
	
	// Ненужная хрень.
	map.on('click', function(e) {
		console.log("Coordinates:", e.latlng);
	});
	
	// Установка местоположения текущего пользователя.
	map.locate({setView: true, watch: true}).on('locationfound', function(e) {
	    //DG.marker([e.latitude, e.longitude]).addTo(map);
	}).on('locationerror', function(e) {
	    console.error("Location access denied.");
	    console.error(e);
	});
	
	// Получение местоположения пользователей и расстановка точек на карте.
	$.get("/api/user-locations").done(function(data, textStatus) {
		data.locations.forEach(function(point) {
			DG.marker(point.coord).addTo(map).bindPopup(`
				<span style="margin: 0px 10px 10px 0px; float: left; width: 32px; height: 32px; display: inline-block !important; overflow: hidden; border-radius: 50%; -webkit-border-radius: 50%; -moz-border-radius: 50%;">
					<a href="${point.href}">
						<img src="${point.avatarSrc}" alt="" width="32" height="32">
					</a>
				</span>
				<a href="${point.href}">${point.name}</a>
				<div style="margin-top: 5px;">
					<i class="fa fa-group"></i>&nbsp;
					<i class="pg-social"></i>&nbsp;
					<i class="fa fa-puzzle-piece"></i>
				</div>
			`);
		});
	}).fail(function() {
        console.error("Ошибка при запросе /api/user-locations.");
        console.error(arguments);
	});
	
	
	
});

