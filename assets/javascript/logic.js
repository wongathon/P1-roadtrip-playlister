$(document).ready(function(){

var config = {
    apiKey: "AIzaSyDczdZqYLRkIJ4hw_OdX3Quwi6oHfo6ASk",
    authDomain: "roadtrip-playlister.firebaseapp.com",
    databaseURL: "https://roadtrip-playlister.firebaseio.com",
    storageBucket: "roadtrip-playlister.appspot.com",
    messagingSenderId: "180325085980"
};

firebase.initializeApp(config);






console.log("Hello hello");


$("button").on("click", function() {

	console.log("Hi"); 
	var queryURL = 
	//comment
	$.ajax({
		url: queryURL,
		method: "GET"
	})
	.done(function(response) {
		console.log(response);

		var results = response.data;

		// for (var i = 0; i < results.length; i++) {

		// }
	});
});


});