

 var config = {
    apiKey: "AIzaSyAMLIh55goWte3ZPcng3zhso1g1iUgrKrc",
    authDomain: "playlist-builder-66aeb.firebaseapp.com",
    databaseURL: "https://playlist-builder-66aeb.firebaseio.com",
    projectId: "playlist-builder-66aeb",
    storageBucket: "playlist-builder-66aeb.appspot.com",
    messagingSenderId: "121150969392"
  };

  firebase.initializeApp(config);

  var database = firebase.database();
  var start, stop;

  $("#submit").on("click", function(){
  	event.preventDefault();

  	start = $("#start-input").val().trim();
  	stop = $("#end-input").val().trim();

  	console.log(start, stop);

  	database.ref().push({
  		start: start,
  		stop: stop
  	
  	});
  });

//Get the starting and destination addresses and push them to the database


var timey = [];
var addy = [];
var songIDsSpotifyMain = [];

//dense google maps stuff
function initMap(){
	var markerArray = [];
	var directionsService = new google.maps.DirectionsService; //instantiate a directions service
	var directionsDisplay = new google.maps.DirectionsRenderer; //renderer for directions, binds to map
	var map = new google.maps.Map(document.getElementById('map'), { //
		zoom: 7,
		draggable: false,
		scrollwheel: false,
		panControl: false,
		disableDefaultUI: true,
		center: {lat: 38.90, lng: -77.03},
		mapTypeId: 'hybrid'
	});
	directionsDisplay.setMap(map);

	var stepDisplay = new google.maps.InfoWindow;

	//remove after testing?
	calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map);

	document.getElementById('submit').addEventListener('click', function(e){
		e.preventDefault();
		calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map);

	});

}

function calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map) {

	addy = [];
	timey = [];

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
			showSteps(response, markerArray, stepDisplay, map);
			setTimeout(function() {
				console.log(addy, timey);
				var convert = consolidateCities(addy, timey);
				console.log(convert);
				displaySongs(convert[0], convert[1]);
			}, 1000);
		} else {
			window.alert('Directions request failed due to '+ status);
		}
	});
}


function showSteps(directionResult, markerArray, stepDisplay, map){
	var myRoute = directionResult.routes[0].legs[0];
	//console.log(myRoute);

	for (var i = 0; i<myRoute.steps.length; i++){
		var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
		marker.setMap(map);
		marker.setPosition(myRoute.steps[i].start_location);
		
		timey.push(myRoute.steps[i].duration.value);

		var laty = myRoute.steps[i].end_point.lat();
		var lngy = myRoute.steps[i].end_point.lng();

		var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+laty+","+lngy+"&sensor=true";
		
		$.ajax({
			url:queryURL,
			method: "GET"
		}).done(function(response){
			var q = response.results[0].formatted_address;
			var r = q.split(", ");
			addy.push(r[1]); 
		});
		attachInstructionText(
			stepDisplay, marker, myRoute.steps[i].instructions, map)
	} //FOR LOOP COMPLETE
}



function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
}

//query for song, times, add <divs> to table values. 
function doSearch(city, seconds){
 	
  var songsNum = Math.round(seconds/210); //seconds of travel divided by avg. song length
  if (songsNum < 1){
  	songsNum = 3; //3 songs seems about right for per/city on a road trip. Approximated. 
  };

  //to be used for spotify playlist-maker API
  songIDsSpotifyMain = [];
  var songIDsSpotifyCity = [];


  $("#songs-list").empty();
  var myUrl = 'https://api.spotify.com/v1/search?type=track&q=' + encodeURIComponent(city) + "&type=track&offset=0&limit=" + songsNum;

  $.ajax({
    url: myUrl,
    method: "GET"
  }).done(function(r){

  	//console.log(r);
  	//console.log(r.tracks.items);
    for (var i=0; i<r.tracks.items.length; i++){
    	var di = $("<tr>");
        var s = r.tracks.items[i].name; //Gets Name of songs

        var id = r.tracks.items[i].id; //Collects ID's to master ID list for Spotify API playlist
        songIDsSpotifyCity.push(id);

        var z;
       	di.append("<td>"+s+"</td>");

      for (var j=0; j<r.tracks.items[i].artists.length; j++){ // Prints Artists
        var a = r.tracks.items[i].artists[j].name;
        z = $("<td>");
        z.append(a);
      }
      di.append(z);
      $("#songs-list").append(di);
    }
    songIDsSpotifyMain.push(songIDsSpotifyCity); // Doesn't Work right now
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

  console.log(cityCatch);
  console.log(timeCatch);
  return [cityCatch, timeCatch];
}




//}); //doc on ready END





