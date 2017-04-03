

var config = {
    apiKey: "AIzaSyDczdZqYLRkIJ4hw_OdX3Quwi6oHfo6ASk",
    authDomain: "roadtrip-playlister.firebaseapp.com",
    databaseURL: "https://roadtrip-playlister.firebaseio.com",
    storageBucket: "roadtrip-playlister.appspot.com",
    messagingSenderId: "180325085980"
};

firebase.initializeApp(config);


var timey = [];
var addy = [];

//dense google maps stuff
function initMap(){
	var markerArray = [];
	var directionsService = new google.maps.DirectionsService; //instantiate a directions service
	var directionsDisplay = new google.maps.DirectionsRenderer; //renderer for directions, binds to map
	var map = new google.maps.Map(document.getElementById('map'), { //
		zoom: 7,
		center: {lat: 38.90, lng: -77.03}
	});
	directionsDisplay.setMap(map);

	var stepDisplay = new google.maps.InfoWindow;

	document.getElementById('submit').addEventListener('click', function(e){
		e.preventDefault();
		calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map);
	});
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map) {

	for (var i = 0; i< markerArray.length; i++){
		markerArray[i].setMap(null);
	}

	directionsService.route({
		origin: document.getElementById('start-input').value,
		destination: document.getElementById('end-input').value,
		travelMode: 'DRIVING'
	}, function(response, status){
		if (status === 'OK') {
			document.getElementById('warnings-panel').innerHTML = 
				'<b>' + response.routes[0].warnings + '</b>';
			directionsDisplay.setDirections(response);
			showSteps(response, markerArray, stepDisplay, map)
		} else {
			window.alert('Directions request failed due to '+ status);
		}
	});
}


function showSteps(directionResult, markerArray, stepDisplay, map){
	var myRoute = directionResult.routes[0].legs[0];
	console.log(myRoute);

	for (var i = 0; i<myRoute.steps.length; i++){
		var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
		
		//console.log(myRoute.steps[i].duration.value + " seconds");
		timey.push(myRoute.steps[i].duration.value);

		var laty = myRoute.steps[i].end_point.lat();
		var lngy = myRoute.steps[i].end_point.lng();

		var queryURL = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+laty+","+lngy+"&sensor=true";
		

		$.ajax({
			url:queryURL,
			method: "GET"
		}).done(function(response){
			var q = response.results[0].formatted_address
			var r = q.split(",");
			addy.push(r[1]); //change back 

		});
	
		attachInstructionText(
			stepDisplay, marker, myRoute.steps[i].instructions, map)
	}

	console.log(timey);
	console.log(addy);

	setTimeout(function() {

		var convert = consolidateCities(addy, timey);
		displaySongs(convert[0], convert[1]);
	}, 250);
	//displaySongs(addy, timey);
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
}

//query for song, times, add <divs> to table values. 
function doSearch(city, seconds){
 	
  var songsNum = Math.round(seconds/210); //seconds of travel divided by avg. song length
  if (songsNum < 1){
  	songsNum = 1;
  };

  var myUrl = 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(city) + "&type=track&offset=0&limit=" + songsNum;

  $.ajax({
    url: myUrl,
    method: "GET"
  }).done(function(r){

    for (var i=0; i<r.tracks.items.length; i++){
    	var di = $("<tr>");
        var s = r.tracks.items[i].name;
        var z;
       	di.append("<td>"+s+"</td>");
      for (var j=0; j<r.tracks.items[i].artists.length; j++){
        var a = r.tracks.items[i].artists[j].name;
        z = $("<td>");
        z.append(a);
      }
      di.append(z);
      $("#songs-list").append(di);
    }
  });

}

function displaySongs(arr1, arr2){
	for (var i=0; i<arr1.length; i++){
		doSearch(arr1[i], arr2[i]);
	};
}

//need to consolidate lists to add times - else first song from query will be called multiple times. 
function consolidateCities(arr1, arr2){

  cityCatch = [];
  timeCatch = [];

  for (var i=0; i<arr1.length; i++){
    if (arr1[i] == arr1[i+1]){
      arr1.shift();
      arr2[i+1] += arr2[i];
      arr2.shift();
      i--;      
    } else {
      cityCatch[i] = arr1[i];
      timeCatch[i] = arr2[i];
    }
  };

  return [arr1, arr2];

}




//}); //doc on ready END





