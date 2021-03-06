var map, heatmapPos, heatmapNeg, cityCenter = {lat: 30.317, lng: -97.743}, DELAY = 150;

//SAMPLE DATA MAX SIZE
//var MAX_POINTS = 11662; 
var MAX_POINTS = 424;
	
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
		context: document.body,
        dataType:"json",
	}).done(function(data) {

        for (var key in data) {
          if (data.hasOwnProperty(key)) {
                innerData = data[key];
                var fields = innerData["fields"];
                var post = {
                    sentiment:fields["sentiment"],
                    tags:fields["tags"],
                    timestamp:fields["timestamp"],
                    value:fields["value"],
                    statement:fields["statement"],
                    poster:fields["poster"]
                };
                post["tags"] = post["tags"].substring(0,post["tags"].length-2);
                posts.push(post);
          }
          else return;
          document.getElementById('numPosts').innerHTML = "Number of posts: "+posts.length;
        }
		setTimeout(function() {
			var i = 0;
            for(; i < heatmapPos.data.length && i < posts.length; i++) {
                addMarker(heatmapPos.data.getAt(i), posts[i]);
            }
            var posPosts = i;
			for(i = 0; i < heatmapNeg.data.length && i < posts.length - posPosts; i++) {
                addMarker(heatmapNeg.data.getAt(i), posts[i]);
            }
			
            if (!google.maps.Polygon.prototype.getBounds) {
 
            google.maps.Polygon.prototype.getBounds=function(){
                var bounds = new google.maps.LatLngBounds()
                this.getPath().forEach(function(element,index){bounds.extend(element)})
                return bounds
            }
             
            }
            
            map.fitBounds(cityHightlight.getBounds());
        }, DELAY);
	});

	// Add a marker to the map when called
	function addMarker(location, post) {
		
		if(post === undefined) {
			console.log("addMarker was sent undefined post");
			return;
		}
		
		// Markers
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title: "Location: " + location.toString(),
			icon:'/static/grey-marker.png'
		});
		
		//Only display the first 20 markers
		if(InfoMarkers.length < 20){
			marker.setMap(map);
		}
		else {
			marker.setMap(null);
		}

		// InfoWindow
		var contentString = 
		'<h2>Comment</h2>'+
		'<div>'+post["statement"]+'</div><br>';
		if(post["poster"].length > 0)
			contentString+='<div>Commenter: '+post["poster"]+'</div>';
		if(post["timestamp"].length > 0)
			contentString+='<div>Time of Post: '+post["timestamp"]+'</div>';
		// if(post["recipient"].length > 0)
			// contentString+='<div>Recipient: '+post["recipient"]+'</div>';
		if(post["tags"] != null && post["tags"].length > 0)
			contentString+='<strong><div>Keywords: '+post["tags"]+'</div></strong>';
		var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
		
		// Custom InfoMarker object
		var InfoMarker = {
			Marker:marker,
			InfoWindow:infowindow,
			heatPoint:heatmapNeg.data.getAt(InfoMarkers.length)
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
	 var tag = document.getElementById('textarea').value.toString();
	 var tagged = [];
	 var checkTag;
	 for (var i = 0; i < InfoMarkers.length; i++) {
		 setMapOnAll(null, InfoMarkers);
	 }
	 for (var i = 0; i < InfoMarkers.length; i++) {
		 // Get tag from InfoWindow
        if(InfoMarkers[i].InfoWindow.content.includes("<strong><div>Keywords: ")) {
             checkTag = InfoMarkers[i].InfoWindow.content.split("<strong><div>Keywords: ")[1].split("</div></strong>")[0];
     
             if(checkTag.includes(", "))
             {
                 var flag = false;
                 checkTag = checkTag.split(", ");
                 console.log(checkTag);
                 for(var j = 0; j < checkTag.length && flag === false; j++)
                 {
                      if(checkTag[j] === tag) {
                        tagged.push(InfoMarkers[i]);
                        flag = true;
                      }
                 }
            } 
            else if(checkTag === tag) {
                tagged.push(InfoMarkers[i]);
            }
        }
		
	 }

	 for (var i = 0; i < tagged.length; i++) {
		 setMapOnAll(map, tagged);
	 }
        document.getElementById('numPosts').innerHTML = "Number of matching posts: "+tagged.length;
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
		
		cityHightlight.setMap(null);
        cityHightlight.strokeOpacity = 0;
		
		setTimeout(function() {
			var genPointsPos = [];
			var genPointsNeg = [];
			var bounds = new google.maps.LatLngBounds();
			
			// Calculate the bounds of the polygon
			for (var i = 0; i < cityHightlight.getPath().getLength(); i++) {
				bounds.extend(cityHightlight.getPath().getAt(i));
			}

			var sw = bounds.getSouthWest();
			var ne = bounds.getNorthEast();

			var numPoints = 0;
			//Main source of lag in map
			while(numPoints < MAX_POINTS/2) {
			   var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
			   var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
			   var point = new google.maps.LatLng(ptLat,ptLng);
			   // Add point if it's inside the bounds of polygon
			   if (google.maps.geometry.poly.containsLocation(point,cityHightlight)) {
					genPointsPos.push(new google.maps.LatLng(ptLat,ptLng));
					numPoints++;
			   }
			}
			
			// Generate Heatmap from getPoints()
			heatmapPos = new google.maps.visualization.HeatmapLayer({
				data: genPointsPos,
				radius:7,
				gradient:[
				'rgba(255, 0, 0, 0.1)',
				'rgba(255, 0, 0, 0.7)',
				'rgba(255, 0, 0, 0.9)',
				'rgba(255, 0, 0, 1)',
				'rgba(255, 0, 0, 1)'
				],
				map: map
			});
			
			while(numPoints < MAX_POINTS) {
			   var ptLat = Math.random() * (ne.lat() - sw.lat()) + sw.lat();
			   var ptLng = Math.random() * (ne.lng() - sw.lng()) + sw.lng();
			   var point = new google.maps.LatLng(ptLat,ptLng);
			   // Add point if it's inside the bounds of polygon
			   if (google.maps.geometry.poly.containsLocation(point,cityHightlight)) {
					genPointsNeg.push(new google.maps.LatLng(ptLat,ptLng));
					numPoints++;
			   }
			}
			
			// Generate Heatmap from getPoints()
			heatmapNeg = new google.maps.visualization.HeatmapLayer({
				data: genPointsNeg,
				radius:7,
				gradient:[
				'rgba(0, 255, 0, 0.1)',
				'rgba(0, 255, 0, 0.7)',
				'rgba(0, 255, 0, 0.9)',
				'rgba(0, 255, 0, 1)',
				'rgba(0, 255, 0, 1)'
				],
				map: map
			});
		
		document.getElementById('map').style.visibility = "visible";
		document.getElementById('map-wrapper').style.visibility = "hidden";
		// Wait DELAY milliseconds for polygon to finish generating
		}, DELAY);
	});
}

google.maps.event.addDomListener(window, 'load', initMap);