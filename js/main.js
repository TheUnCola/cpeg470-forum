/*
global $
global firebase
*/
'use strict';

$(document).ready(start => {
	console.log("Main JS loaded.");
	
	var db = firebase.database();
	
	// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
	
	var provider = new firebase.auth.GithubAuthProvider();

	firebase.auth().onAuthStateChanged(function(user) {
	   if(user) {
	       //Logged in
	       $('#message').html(`User ID: ${user.uid} email: ${user.email}`);
	   } else {
	       $('#message').html(`Not logged in`);
	   }
	});
	
	$("#login").click(function(evt){
	    firebase.auth().signInWithPopup(provider).then(function(result) {
	      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
	      var token = result.credential.accessToken;
	      // The signed-in user info.
	      var user = result.user;
	    
	    $('#message').html(`User ID: ${user.uid} email: ${user.email}`);
	});
	
	});
	
	$('#logout').click(function(evt){
	    firebase.auth().signOut();
	    $('#message').html(`Logged Out.`);
	});

	
	
	function temp(id, student, callback, error) {
		return db.ref(`students/${id}`).update(student)
			.then(function(res) {
				callback("Success");
			},
			function(error) {
				console.log(error);
		});
	};
	
	firebaseService.getStudents(function(students) {
	    $scope.students = students;
	    console.log(students);
	    $scope.$apply();
	  }, function(error) {
	    console.log(error);
	  });
	
	this.getStudents = function(success, failure) {
    return db.ref("students").once("value")
    .then(function(snapshot) {
      success(castManyToStudent(snapshot.val()));
    }, function(error) {
      failure(error);
    });
  };
	
	
	
	
	
	
	


	
	
});








function populateTopics(argument) {
	function test(success, failure) {
		return db.ref("students").once("value")
		.then(
			function(snapshot) {
				success(blah(snapshot.val()));
			},
			function(error) {
				failure(error);
			}
		);
	}
	function blah(){
		
	}
	
	
	// change to firebase calls
	let url = 'https://websec2-commandogn.c9users.io/topic';
	$.get(url).then(
		(response) => {
			
			
			console.log(response);
			
			let frag = document.createDocumentFragment();
			for(let i = 0; i < response.length; i++) {
				let clone = document.importNode($('#topicTemplate')[0].content, true);
				clone.querySelector('td').dataset['id'] = response[i]._id;
				
				clone.querySelector('.topicTitleSpan').innerHTML = response[i].title;
				clone.querySelector('.topicCreatorSpan').innerHTML = response[i].creator;
				clone.querySelector('.topicDescriptionSpan').innerHTML = response[i].description;
				frag.appendChild(clone);
			}
			$('#postsGoHere').append(frag);
		},
		(err) => console.log(err)
	);
}