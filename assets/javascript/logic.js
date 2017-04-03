

var config = {
    apiKey: "AIzaSyDczdZqYLRkIJ4hw_OdX3Quwi6oHfo6ASk",
    authDomain: "roadtrip-playlister.firebaseapp.com",
    databaseURL: "https://roadtrip-playlister.firebaseio.com",
    storageBucket: "roadtrip-playlister.appspot.com",
    messagingSenderId: "180325085980"
};

firebase.initializeApp(config);

//Get the starting and destination addresses and push them to the database


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

	calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map);

	var onChangeHandler = function(){
		calculateAndDisplayRoute(directionsService, directionsDisplay, markerArray, stepDisplay, map);
	};
	document.getElementById('start-input').addEventListener('onchange', onChangeHandler);
	document.getElementById('end-input').addEventListener('onchange', onChangeHandler);

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
		console.log(myRoute.steps[i].duration.value + " seconds");
		console.log(myRoute.steps[i]);
		var encody = myRoute.steps[i].encoded_lat_lngs;
	
		attachInstructionText(
			stepDisplay, marker, myRoute.steps[i].instructions, map)
	}
}

function attachInstructionText(stepDisplay, marker, text, map) {
    google.maps.event.addListener(marker, 'click', function() {
      // Open an info window when the marker is clicked on, containing the text
      // of the step.
      stepDisplay.setContent(text);
      stepDisplay.open(map, marker);
    });
}

$(document).ready(function(){

	$("#submit").on("click", function(){
		event.preventEventDefault();
	});

});