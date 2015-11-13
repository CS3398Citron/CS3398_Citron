

var map, heatmap, cityCenter = {lat: 30.317, lng: -97.743}, postNum = 1;

//SAMPLE DATA MAX SIZE
//var MAX_POINTS = 11662; 
var MAX_POINTS = 1000;
	
var cityHightlight;

var InfoMarkers = [], posts = [];

// Initialize the map
function initMap() {
	document.getElementById('map').style.visibility = "hidden";
	
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 10,
		center: cityCenter
	});
	
	getPoints(MAX_POINTS);
	
	// Add post associated to every heat point
	$.ajax({
		type:"GET",
		url:"/postsJsonObject/",
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
			if(data[i].includes('swarmapp')){
				data[i] = data[i].split('swarmapp')[0];
			}
			else {
				data[i] = data[i].substr(0,data[i].length-4);
			}
			
			posts.push(data[i]);
		}
		
		for(var i = 0; i < heatmap.data.length; i++) {
			addMarker(heatmap.data.getAt(InfoMarkers.length), posts[postNum].substr(1,posts[postNum].length));
			postNum++;
		}
	});

	// Add a marker to the map when called
	function addMarker(location, post) {
		
		var info = [location, post, "", "", "", "", "", ""];
		
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
		
		//Only display the first 20 markers
		if(InfoMarkers.length < 20){
			marker.setMap(map);
		}
		else {
			marker.setMap(null);
		}
		
		//Time
		var time;
		if(post.includes('at 1')) {
			time = post.split(/\\nat /g)[1];
		}
		else if(post.includes('at 2')) {
			time = post.split(/\\nat /g)[1];
		}
		else {
			time = "0";
		}

		post = cleanPost(post);
		

		//Poster's name and Twitter Handle
		var posterName = post.split('@');
		var posterHandle = '@'+posterName[1].split(" ")[0];
		posterName = posterName[0];
		info[2] = posterName;
		info[3] = posterHandle;
		
		
		//remove name and handle
		post = post.split(posterHandle+' ')[1];
		//remove time
		post = post.split( 'at '+info[4])[0];
		
		//remove reply
		if(time !== "0" && time.includes(' in reply to ')) {
			info[4] = time.split(' in reply to ')[0];
			info[5] = time.split(' in reply to ')[1];
		}
		else {
			info[4] = time;
		}
		
		var tags = [];
		var newTags = post.split('#');
		
		// Search for hashtags, split by tag and "\"
		for(var i = 1; i < newTags.length; i++) {
			tags.push(newTags[i].split(" ")[0]+" ");
		}
		
		if(tags.length === 0) {
			tags = "";
		}
		
		// InfoWindow
		var contentString = 
		'<h2>Location: '+info[0]+'</h2>'+
		'<div>'+info[1]+'</div><br>';
		if(info[2].length > 0)
			contentString+='<div>Poster: '+info[2]+'</div>';
		if(info[3].length > 0)
			contentString+='<div>Twitter Handle: '+info[3]+'</div>';
		if(info[4] !== "0")
			contentString+='<div>Time of Post: '+info[4]+'</div>';
		if(info[5].length > 0)
			contentString+='<div>Replying to: '+info[5]+'</div>';
		if(info[6].length > 0)
			contentString+='<strong><div>Tags: '+info[6]+'</div></strong>';
		var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
		
		// Custom InfoMarker object
		var InfoMarker = {
			Marker:marker,
			InfoWindow:infowindow,
			heatPoint:heatmap.data.getAt(InfoMarkers.length)
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
	
	//Displays highlight of city
	document.getElementById('highlight').onclick = function highlight(){
		if(cityHightlight.strokeOpacity === 0) {
			cityHightlight.strokeOpacity = 1;
			cityHightlight.setMap(map);
		}
		else {
			cityHightlight.strokeOpacity = 0;
			cityHightlight.setMap(null);
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
		 // Get tag from InfoWindow
		 checkTag = InfoMarkers[i].InfoWindow.content.split("<tag>Tag: ")[1].split("</tag>")[0]+" ";
		 
		if(checkTag === tag) {
			tagged.push(InfoMarkers[i]);
		}
	 }

	 for (var i = 0; i < tagged.length; i++) {
		 setMapOnAll(map, tagged);
	 }

	}
}

function getPoints(MAX_POINTS) {
	// Parse HTML into Google Maps LatLng Objects
	$.ajax({
		url:"/static/AustinPolygon.html"
	}).done(function(data) {
		
		var paths = [];

		data = data.split(" ");
		for(var i = 0; i < data.length; i++) {
			var coords = data[i].split(",");
			paths.push(new google.maps.LatLng(coords[1],coords[0]));
		}
	
		// DRAW THE POLYGON OR POLYLINE
		cityHightlight = new google.maps.Polygon({
			clickable: false,
			paths: paths,
			strokeColor: 'black',
			strokeOpacity: 0.1,
			strokeWeight: 1,
			fillColor: 'white',
			fillOpacity: 0
		});
		
		cityHightlight.setMap(map);
		
		setTimeout(function() {
			var genPoints = [];
			var bounds = new google.maps.LatLngBounds();
			
			// Calculate the bounds of the polygon
			for (var i = 0; i < cityHightlight.getPath().getLength(); i++) {
				bounds.extend(cityHightlight.getPath().getAt(i));
			}

			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();

			var numPoints = 0;
			//Main source of lag in map
			while(numPoints < MAX_POINTS) {
			   var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
			   var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
			   var point = new google.maps.LatLng(ptLat,ptLng);
			   // Add point if it's inside the bounds of polygon
			   if (google.maps.geometry.poly.containsLocation(point,cityHightlight)) {
					genPoints.push(new google.maps.LatLng(ptLat,ptLng));
					numPoints++;
			   }
			}
			
				// Generate Heatmap from getPoints()
			heatmap = new google.maps.visualization.HeatmapLayer({
				data: genPoints,
				radius:3,
				map: map
			});
		
		document.getElementById('map').style.visibility = "visible";
		document.getElementById('map-wrapper').style.visibility = "hidden";
		// Wait 1000 milliseconds for polygon to finish generating
		}, 1000);
	});
}

function cleanPost(post) {
	// Cleaning unicode garbage out of posts
	//remove unicode
	post = post.replace(/\\u([\d\w]{4})/gi, function (match, grp) { return String.fromCharCode(parseInt(grp, 16)); } );
	//remove escaped quotes
	post = post.replace(/\\"/gi, '"');
	//remove newline chars
	post = post.replace(/\\n/gi, " ");

	//remove â€¦
	post = post.replace(/â€¦/gi, "");
	
	return post;
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