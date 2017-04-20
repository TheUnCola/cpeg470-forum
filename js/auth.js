/*
global $
global firebase
global db
*/
var user = firebase.auth().currentUser;	// may start out as undefined
var dbhandler = db.ref();
var provider = new firebase.auth.GithubAuthProvider();


$(document).ready(start => {
	// FIXME: causing issues bc async
	firebase.auth().onAuthStateChanged(function(_user) {
		console.log('auth state changed');
		if(_user) {
			//Logged in
			// console.log(_user);
			user = _user;
			console.log("Logged in! User:");
			$('#message').html(`Welcome, ${_user.displayName}!`);
			$('#login').hide();
			$('#logout').show();
		} else {
			console.log('not logged in');
		   	$('#login').show();
		   	$('#logout').hide();
		   	$('#message').html(`Not logged in`);
		}
	});
	
	$("#login").click(function(evt){
	    firebase.auth().signInWithPopup(provider).then(function(result) {
		      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
		      //var token = result.credential.accessToken;
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