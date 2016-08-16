
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
	    DG.marker([e.latitude, e.longitude]).addTo(map);
	}).on('locationerror', function(e) {
	    console.error("Location access denied.");
	    console.error(e);
	});
	
	// Получение месторасположения пользователей и расстановка точек на карте.
	$.get("/api/user-locations").done(function(data, textStatus) {
		data.forEach(function(point) {
			DG.marker(point.coord).addTo(map).bindPopup(point.name);
		});
	}).fail(function() {
        console.error("Ошибка при запросе /api/user-locations.");
        console.error(arguments);
	});
	
	
	
});

