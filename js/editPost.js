/*
global $
global firebase
global db
global user
global filterXSS
*/
'use strict';
console.log("Edit Post JS loaded.");

var postID = filterXSS(window.location.hash.substring(1));
console.log(`PostID: ${postID}`);
if(!postID) {// || !firebase.auth().currentUser) {
	// Don't wait until the page is loaded to check if the user is authorized to post
	// Ik this is in the client-side, but we'll have authorization sanity checks in the firebase rules (TODO)
	console.log("No PostID or no user");
	console.log(`User:  + ${user}`);
	window.location.assign("/views/error.html");
}



// TODO: some sort of client-side sanitization


var oldPost = undefined; // Set in getPost()
$(document).ready(ready => {
	getPost(
		postID,
		loadPost,
		err => console.log(err)
	);
	
	
	$('#postForm').submit((evt) => {
		evt.preventDefault();
		
		let _title = filterXSS($('input[name=postTitle]').val());
		let _body = filterXSS($('textarea[name=postBody]').val());
		
		let data = {
			// authorID: user.uid,
			modifiedAt: firebase.database.ServerValue.TIMESTAMP
		};
		if(oldPost.title != _title)
			data.title = _title;
		if(oldPost.body != _body)
			data.body = _body;
		
		let pushRef = db.ref(`Posts/${postID}`);
		pushRef.update(data).then(
			(success) => {
				console.log("Successfully updated post!");
				window.location.assign(`/views/post.html#${postID}`);
			},
			(err) => {
				console.log(err);
				console.log("Edit post pushRef error");
				window.location.assign("/views/error.html");
			}
		);
	});
	
	
	$('#deletePost').click(evt => {
		if(window.confirm("Are you sure you want to delete this post??!?!?!?!!!!?!?!?!?!?!?!??!!?!?!?!?!!?!?!?")) {
			deletePost(
				postID,
				(success) => {
					console.log("Successfully deleted post!");
					window.location.assign(`/`);
				},
				(err) => console.err("Error deleting post")
			);
		}
	});
	
});


$(window).on('hashchange', (evt) => {
	postID = filterXSS(window.location.hash.substring(1));
	console.log("Hash change triggggggererrereeed: " + postID);
	
	getPost(
		postID,
		loadPost,
		err => console.log(err)
	);
});


function getPost(postID, success, failure) {
	return db.ref(`Posts/${postID}`)
	.once("value").then(
		function(snapshot) {
			// console.log("Snapshot: ");
			console.log(snapshot.val());
			if(snapshot.val().authorID !== user.uid) {
				// console.log('snap: ' + snapshot.val().authorID);
				// console.log('user: ' + user.uid);
				console.error('Error, authorID does not match user id');
				window.location.assign('/views/error.html');
			}
				
			oldPost = snapshot.val();
			success(oldPost);
		},
		function(error) {
			failure(error);
		}
	);
}

function loadPost(post) {
	// console.log(posts);
	let frag = document.createDocumentFragment();
	let clone = document.importNode($('#postTemplate')[0].content, true);
	clone.querySelector('.postTitleSpan').value = filterXSS(post.title);
	clone.querySelector('.postBodySpan').innerHTML = filterXSS(post.body);
	clone.querySelector('.tbAuthor').innerHTML = filterXSS(post.author);
	clone.querySelector('.tbLastEdit').innerHTML = formatDate(post.modifiedAt);
	frag.appendChild(clone);
	$('#postGoesHere').append(frag);
}

function deletePost(postID, success, failure) {
	if(!!oldPost) {
		if(oldPost.authorID !== user.uid) {
			console.error('Error, authorID does not match user id');
			window.location.assign('/views/error.html');
		}
	}
	return db.ref(`Posts/${postID}`).remove().then(success).catch(failure);
}