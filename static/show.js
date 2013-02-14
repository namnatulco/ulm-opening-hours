var map;
var overlayMaps;
var ctrls;
var entity_groups = [];
var tile_groups = [];
var ctrls;

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/1443dfdd3c784060aedbf4063cd1709b/997/256/{z}/{x}/{y}.png';
var cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';


document.addEventListener('DOMContentLoaded', function() {

	var socket = io.connect('http://localhost');

	socket.on('initialisation', function (open_entities) {    
		for (var i in open_entities) {
			entity = open_entities[i];

			if (entity_groups[entity.category] == undefined) {
				entity_groups[entity.category] = [];
				tile_groups[entity.category] = [];
			}



			entity_groups[entity.category].push( 
				L.marker(
					//[entity.lat, entity.lon]).addTo(map).bindPopup(
					[entity.lat, entity.lon]).bindPopup(
					entity.name
					+ "<br />" + entity.original_opening_hours
					+ "<br />" + entity.category
					)
			);
		}

		for (var i in entity_groups) {
			tile_groups[i] = L.layerGroup(entity_groups[i]);
		}


		//var tile_groups = L.tileLayer(cloudmadeUrl, {styleId: 22677, attribution: cloudmadeAttribution}),

		map = L.map('map', {
			center: new L.LatLng(48.400500, 9.9794349)
			, zoom: 14
			, layers: tile_groups
		});
		L.tileLayer(cloudmadeUrl, {attribution: cloudmadeAttribution}).addTo(map);

		overlayMaps = {};
		for (var i in tile_groups) {
			overlayMaps[i] = tile_groups[i];
			tile_groups[i].addTo(map);
		}

		var info = L.control();
		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'leaflet-control '
				+ 'leaflet-control-layers leaflet-control-layers-expanded');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Ulm Opening Hours<br /><span id="time"></span></h4>';
		};

		info.addTo(map);

		var all_ctrls = L.control();
		all_ctrls.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'leaflet-control '
				+ 'leaflet-control-layers leaflet-control-layers-expanded');
			this.update();
			return this._div;
		};

		all_ctrls.update = function (props) {
			this._div.innerHTML = "<div class='all_ctrls'><a href='javascript:all(true);'>Alle aktivieren</a>" +
				"&nbsp;|&nbsp;" + 
				"<a href='javascript:all(false);'>Alle deaktivieren</a></div>";
		};

		ctrls = L.control.layers(null, overlayMaps, {collapsed: false})
		ctrls.addTo(map);
		all_ctrls.addTo(map);

		/*
		ctrls._container.innerHTML = '<h4>Ulm Opening Hours<br /><span id="time"></span></h4>'
		+ ctrls._container.innerHTML;

		ctrls._container.innerHTML += "<hr /><div class='all_ctrls'><a href=''>Alle aktivieren</a>" +
		"&nbsp;|&nbsp;" + 
		"<a href='javascript:all(false);'>Alle deaktivieren</a></div>";
		*/



});

	socket.on('time', function (time) {    
		document.getElementById('time').innerHTML = 
			"<strong>" + time.hours + ":" + time.mins + "</strong>";
	});




/*
	map = L.map('map').setView([48.400500,9.979434], 14);
	L.tileLayer('http://{s}.tile.cloudmade.com/1443dfdd3c784060aedbf4063cd1709b/997/256/{z}/{x}/{y}.png'
	, {attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade'}).addTo(map);
	'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'}).addTo(map);
	*/

}, false);


function all(v) {
	for (var i in ctrls._form) {
		if (ctrls._form[i] !== null && ctrls._form[i].type === "checkbox") {
			ctrls._form[i].checked = v;
		}
	}
	ctrls._onInputClick();
}