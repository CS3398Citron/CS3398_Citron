var map, heatmap, cityCenter = {lat: 30.317, lng: -97.743}, postNum = 1, MAX_POINTS = 250;

// Call getPoints to generate random points for heatmap
var heatPoints = getPoints(MAX_POINTS);

var InfoMarkers = [], posts = [];

// Initialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: cityCenter
	});
	
	// Generate Heatmap from getPoints()
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: heatPoints,
		radius:5,
		map: map
	});
	
	// Add post associated to every heat point
	$.ajax({
		url:"/admin/postsJsonObject/",
		context: document.body
	}).done(function(data) {
		data = data.split('statement');
		
		for(var i = 0; i < data.length; i++) {
			data[i] = data[i].substr(3,data[i].length);
		}
		
		// Clean garbage from posts 
		// (post is from model statement to model poster)
		for(var i = 0; i < data.length; i++) {
			data[i] = data[i].split('poster')[0];
			data[i] = data[i].substr(0,data[i].length-4);
			posts.push(data[i]);
		}
		
		for(var i = 0; i < heatPoints.length; i++) {
			addMarker(heatPoints[InfoMarkers.length], posts[postNum].substr(1,posts[postNum].length));
			postNum+= 1;
		}
		
	});

	// Add a marker to the map when called
	function addMarker(location, post) {
		
		if(post === []) {
			alert("Null post");
			return;
		}
		
		// Markers
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title: location.toString()
		});
		
		if(InfoMarkers.length < 20){
			marker.setMap(map);
		}
		else {
			marker.setMap(null);
		}

		// replace newline char with space
		// post = post.replace(/\n/g, " ");
		
		var tags = [];
		var newTags = post.split('#');
		
		// Search for hashtags, split by tag and "\"
		for(var i = 1; i < newTags.length; i++) {
			tags.push(newTags[i].split(" ")[0].split("\\")[0]+" ");
		}
		
		if(tags.length === 0) {
			tags = "None";
		}
		
		// InfoWindow
		var contentString = 
		'<h2>Location: '+location+'</h2>'+
		'<post>'+post+'</post><br>'+
		'<strong><tag>Tags: '+tags+'</tag></strong>';
		var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
		
		// Custom InfoMarker object
		var InfoMarker = {
			Marker:marker,
			InfoWindow:infowindow,
			heatPoint:heatPoints[InfoMarkers.length]
		};
			
		InfoMarkers.push(InfoMarker);
		
		// Open selected marker's InfoWindow
		google.maps.event.addListener(marker,'click', (
			function(marker,contentString,infowindow){ 
				return function() {
				   infowindow.setContent(contentString);
				   infowindow.open(map,marker);
				};
			})(marker,contentString,infowindow)
		); 
		
	}
	
	// Called when map is clicked
	// google.maps.event.addListener(map, 'click', function(event) {
	// });
	
	// Sets the given map on all InfoMarkers in the array.
	function setMapOnAll(map, array) {
		for (var i = 0; i < array.length; i++) {
			array[i].Marker.setMap(map);
		}
	}
	
	// Removes the markers from the map, but keeps them in the array.
	document.getElementById('hideMarkers').onclick = function hideMarkers() {
	 setMapOnAll(null, InfoMarkers);
	}

	// Shows any markers currently in the array.
	document.getElementById('showMarkers').onclick = function showMarkers() {
	 setMapOnAll(map, InfoMarkers);
	}

	// Deletes all markers in the array by removing references to them.
	document.getElementById('deleteMarkers').onclick = function deleteMarkers() {
	 setMapOnAll(null, InfoMarkers);
	 InfoMarkers = [];
	}
	
	document.getElementById('searchTag').onclick = function searchTag() {
	 var tag = document.getElementById('textarea').value;
	 var tagged = [];
	 var checkTag;
	 for (var i = 0; i < InfoMarkers.length; i++) {
		 setMapOnAll(null, InfoMarkers);
	 }
	 for (var i = 0; i < InfoMarkers.length; i++) {
		 // get tag from InfoWindow
		 checkTag = InfoMarkers[i].InfoWindow.content.split("<tag>Tag: ")[1].split("</tag>")[0]+" ";
		 
		if(checkTag === tag) {
			tagged.push(InfoMarkers[i]);
		}
	 }

	 for (var i = 0; i < tagged.length; i++) {
		 setMapOnAll(map, tagged);
	 }

	}
	document.getElementById('highlight').onclick = function highlight(){
		var cityHightlight;
		// Parse HTML into Google Maps LatLng Objects
		$.ajax({
			url:"/static/AustinPolygon.html",
			context: document.body 
		}).done(function(data) {
			
			var paths = [];

			data = data.split(" ");
			for(var i = 0; i < data.length; i++) {
				var x = data[i].split(",");
				paths.push(new google.maps.LatLng(x[1],x[0]));
			}
		
			// DRAW THE POLYGON OR POLYLINE
			cityHightlight = new google.maps.Polygon({
				clickable: false,
				paths: paths,
				strokeColor: 'black',
				strokeOpacity: 1,
				strokeWeight: 1,
				fillColor: 'white',
				fillOpacity: 0
			});
			cityHightlight.setMap(map);
		});
		return cityHightlight;
	}
	
}


function getPoints(MAX_POINTS) {
	
	var genPoints = [];
	// Generate random points
	for(var i = 0; i < MAX_POINTS; i++) {
		if(i < MAX_POINTS/2)
			genPoints.push(new google.maps.LatLng(cityCenter.lat + Math.random() % 0.1, cityCenter.lng + Math.random() % 0.1));
		else
			genPoints.push(new google.maps.LatLng(cityCenter.lat - Math.random() % 0.1, cityCenter.lng - Math.random() % 0.1));
	}
	
	return genPoints;
}
	
function changeGradient() {
 var gradient = [
	'rgba(0, 255, 255, 0)',
	'rgba(0, 255, 255, 1)',
	'rgba(0, 191, 255, 1)',
	'rgba(0, 127, 255, 1)',
	'rgba(0, 63, 255, 1)',
	'rgba(0, 0, 255, 1)',
	'rgba(0, 0, 223, 1)',
	'rgba(0, 0, 191, 1)',
	'rgba(0, 0, 159, 1)',
	'rgba(0, 0, 127, 1)',
	'rgba(63, 0, 91, 1)',
	'rgba(127, 0, 63, 1)',
	'rgba(191, 0, 31, 1)',
	'rgba(255, 0, 0, 1)'
 ]
 heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

google.maps.event.addDomListener(window, 'load', initMap);