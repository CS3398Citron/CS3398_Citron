var map, heatmap, cityCenter = {lat: 30.317, lng: -97.743};
var Markers = [];
var InfoWindows = [];

//Initialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: cityCenter,
		//mapTypeId: google.maps.MapTypeId.SATELLITE
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
		post = post.replace(/\n/g, " ");
		
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
		
		Markers.push(marker);
		InfoWindows.push(infowindow);
		
		//Open selected marker's InfoWindow
		google.maps.event.addListener(Markers[Markers.length - 1], 'click', function() {
			InfoWindows[InfoWindows.length - 1].open(map,Markers[Markers.length - 1]);
        });
		
		//Double click to delete marker
		google.maps.event.addListener(Markers[Markers.length - 1], 'dblclick', function() {
			Markers[Markers.length - 1].setMap(null);
        });
	}
	
	posts = [];
	postNum = 1;
	//Calls addMarker when map is clicked
	google.maps.event.addListener(map, 'click', function(event) {
		//calls document for every post instead of only storing the first time
		//if(posts.length === 0){
			$.get("/static/Social Media Posts/Austin Twitter Mentions.csv", function(data){ 
				//$("meta.data").append(data);
				//alert(document.getElementById("data").innerHTML);
				//posts = document.getElementById("data").content.split("\","); 
				posts = data.split("\","); 
				addMarker(event, posts[postNum]);
				postNum+= 2;
			});
		//}

	});
	
	// Sets the map on all InfoMarkers in the array.
	function setMapOnAll(map, array) {
		for (var i = 0; i < array.length; i++) {
			Markers[i].setMap(map);
		}
	}
	
	// Removes the markers from the map, but keeps them in the array.
	document.getElementById('hideMarkers').onclick = function hideMarkers() {
	  setMapOnAll(null, Markers);
	}

	// Shows any markers currently in the array.
	document.getElementById('showMarkers').onclick = function showMarkers() {
	  setMapOnAll(map, Markers);
	}

	// Deletes all markers in the array by removing references to them.
	document.getElementById('deleteMarkers').onclick = function deleteMarkers() {
	  setMapOnAll(null, Markers);
	  Markers = [];
	  InfoWindows = [];
	}
	
	document.getElementById('searchTag').onclick = function searchTag() {
	  var tag = document.getElementById('textarea').value;
	  // infoWindow and Markers are unrelated and therefore cannot be associated together as one object, solution requires database calls and results through a query
	  var tagged = [];
	  var checkTag;
	  for (var i = 0; i < Markers.length; i++) {
		  setMapOnAll(null, Markers);
	  }
	  for (var i = 0; i < InfoWindows.length; i++) {
		  //get tag from InfoWindow
		  checkTag = InfoWindows[i].content.split("<tag>Tag: ")[1].split("</tag>")[0]+" ";
		  
		if(checkTag === tag) {
			tagged.push(Markers[i]);
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
		$.get("/static/AustinPolygon.html", function(data) {
			data = data.split(" ");
			for(var i = 0; i < data.length; i++)
			{
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
	for(var i = 0; i < 10; i++)
	{
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