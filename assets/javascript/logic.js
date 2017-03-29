$(document).ready(function(){

var config = {
    apiKey: "AIzaSyDczdZqYLRkIJ4hw_OdX3Quwi6oHfo6ASk",
    authDomain: "roadtrip-playlister.firebaseapp.com",
    databaseURL: "https://roadtrip-playlister.firebaseio.com",
    storageBucket: "roadtrip-playlister.appspot.com",
    messagingSenderId: "180325085980"
};

firebase.initializeApp(config);








$("#add-place").on("click", function() {

	var gMapsKey = "AIzaSyDp2NTOwUzxskBbRvDuutXkl1y9xs0O6xA";
	var gDirectionsKey = "AIzaSyDtKVttNyU9eJxtsNqGTHWCtbqcPxH7MZc";
	var origin = $("#place-1").val().trim();
	var dest = $("#place-2").val().trim();

	origin = origin.split(" ");
	dest = dest.split(" ");

	origin = origin.join('+');
	dest = dest.join('+');
 
	var mapURL = "https://www.google.com/maps/embed/v1/directions?key="+gMapsKey+"&origin="+origin+"&destination="+dest+"&avoid=tolls|highways"
	var queryURL = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+dest+"&key=" + gDirectionsKey;


	$("iframe").attr("src", mapURL);

	$.ajax({
		url: queryURL,
		type: "GET",
		dataType: 'jsonp',
		cache: false,
	})
	.done(function(response) {
		console.log(response);



		var results = response.data;

		// for (var i = 0; i < results.length; i++) {

		// }
	});
});


});