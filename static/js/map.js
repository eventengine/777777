
/* global DG */

var map;

DG.then(function() {
	map = DG.map('map', {
		'center': [54.98, 82.89],
		'zoom': 13,
		'preferCanvas': true,
		'fullscreenControl': false,
		'zoomControl': false,
		'trackResize':	true,
		'geoclicker':	true,
		'watch': true,
		'setView': true,
		'poi': true,
	
	});
	DG.marker([54.98, 82.89]).addTo(map);
	map.on('click', function(e) {
		console.log("Coordinates:", e.latlng);
	});
	map.locate({setView: true, watch: true})
	.on('locationfound', function(e) {
	    DG.marker([e.latitude, e.longitude]).addTo(map);
	})
	.on('locationerror', function(e) {
	    console.log(e);
	    alert("Location access denied.");
	});
});