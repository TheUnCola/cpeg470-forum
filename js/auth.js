/*
global $
global firebase
global db
*/
var user = undefined;
$(document).ready(start => {
	var dbhandler = db.ref();

	var testing = dbhandler.child("test");
	
	var provider = new firebase.auth.GithubAuthProvider();
	
	firebase.auth().onAuthStateChanged(function(_user) {
		console.log("Logged in! User:");
		console.log(_user);
	   if(_user) {
	       //Logged in
	       $('#message').html(`Welcome, ${_user.displayName}!`);
	       $('#login').hide();
	       $('#logout').show();
	       user = _user;
	   } else {
	   		$('#login').show();
	   		$('#logout').hide();
	   		$('#message').html(`Not logged in`);
	   }
	});
	
	$("#login").click(function(evt){
	    firebase.auth().signInWithPopup(provider).then(function(result) {
	      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
	      var token = result.credential.accessToken;
	      // The signed-in user info.
	      user = result.user;
	    
	    $('#message').html(`User ID: ${user.uid} email: ${user.email}`);
	});
	
	});
	
	$('#logout').click(function(evt){
	    firebase.auth().signOut();
	    $('#message').html(`Logged Out.`);
	});
});