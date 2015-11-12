var map, heatmap, cityCenter = {lat: 30.317, lng: -97.743};

var numInfoMarkers = 0;



var InfoMarkers = [];

//Initialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: cityCenter
	});
	
	//Generate Heatmap from getPoints()
	heatmap = new google.maps.visualization.HeatmapLayer({
		data: getPoints(),
		map: map
	});

	//Add a marker to the map when called
	function addMarker(event, post) {
		
		if(post === []) {
			alert("Null post");
			return;
		}
		
		//Marker
		var marker = new google.maps.Marker({
			position: event.latLng,
			map: map,
			title: 'Hover Title'
		});
		
		
		
		//replace newline char with space
		//post = post.replace(/\n/g, " ");
		
		var tags = [];
		var newTags = post.split('#');
		
		for(var i = 1; i < newTags.length; i++) {
			tags.push(newTags[i].split(" ")[0]+" ");
		}
		
		if(tags.length === 0) {
			tags = "None";
		}
		
		//InfoWindow
		var contentString = 
		'<h1>Header of Tag</h1>'+
		'<p>Location: '+event.latLng+'</p>'+
		'<post>'+post+'</post><br>'+
		'<strong><tag>Tags: '+tags+'</tag></strong>';
		var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
		
		//Custom object
		var newInfoMarker = {Marker:null, InfoWindow:null, index:0};
		newInfoMarker.Marker = marker;
		newInfoMarker.InfoWindow = infowindow;
		newInfoMarker.index = numInfoMarkers;
			
		InfoMarkers.push(newInfoMarker);
		
		//update numInfoMarkers
		numInfoMarkers += 1;
		
		//Open selected marker's InfoWindow
		google.maps.event.addListener(InfoMarkers[numInfoMarkers-1].Marker, 'click', function() {
			var current = InfoMarkers[numInfoMarkers-1].index;
			InfoMarkers[current].InfoWindow.open(map,InfoMarkers[current].Marker);
        });
		
		//Double click to delete marker
		google.maps.event.addListener(InfoMarkers[numInfoMarkers-1].Marker, 'dblclick', function() {
			InfoMarkers[numInfoMarkers-1].Marker.setMap(null);
        });
	}
	
	posts = [];
	postNum = 1;
	
	//Calls addMarker when map is clicked
	google.maps.event.addListener(map, 'click', function(event) {
		//Call static file to generate random 
		$.ajax({
			url:"/admin/postsJsonObject/",
			context: document.body 
		}).done(function(data) {
			posts = data.split("\",");
			addMarker(event, posts[postNum].substr(1,posts[postNum].length));
			postNum+= 2;
		});
	});
	
	// Sets the map on all InfoMarkers in the array.
	function setMapOnAll(map, array) {
		for (var i = 0; i < array.length; i++) {
			InfoMarkers[i].Marker.setMap(map);
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
	  // infoWindow and Markers are unrelated and therefore cannot be associated together as one object, solution requires database calls and results through a query
	  var tagged = [];
	  var checkTag;
	  for (var i = 0; i < InfoMarkers.length; i++) {
		  setMapOnAll(null, InfoMarkers);
	  }
	  for (var i = 0; i < InfoMarkers.length; i++) {
		  //get tag from InfoWindow
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
		var CityHightlight;
		var paths = [];

		//Parse HTML into Google Maps LatLng Objects
		$.ajax({
			url:"/static/AustinPolygon.html",
			context: document.body 
			}).done(function(data) {
			data = data.split(" ");
			for(var i = 0; i < data.length; i++) {
				var x = data[i].split(",");
				paths.push(new google.maps.LatLng(x[1],x[0]));
			}
		
			//DRAW THE POLYGON OR POLYLINE
			CityHightlight = new google.maps.Polygon({
				clickable: false,
				paths: paths,
				strokeColor: 'black',
				strokeOpacity: 1,
				strokeWeight: 1,
				fillColor: 'white',
				fillOpacity: 0
			});
			CityHightlight.setMap(map);
		});
	}
}


function getPoints() {
	
	var heatPoints = [];
	//Generate random points
	for(var i = 0; i < 10; i++) {
		heatPoints.push(new google.maps.LatLng(cityCenter.lat + Math.random() % 0.1, cityCenter.lng + Math.random() % 0.1));
		heatPoints.push(new google.maps.LatLng(cityCenter.lat - Math.random() % 0.1, cityCenter.lng - Math.random() % 0.1));
	}
	
	return heatPoints;
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