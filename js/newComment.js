/*
global $
global firebase
global db
global user
global filterXSS
*/
'use strict';
console.log("New Comment JS loaded.");

// EXPERIMENTAL (chrome and firefox, maybe safari, no IE)
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
// let x = new URLSearchParams(window.location);
// let x = window.location.search.substring(1); // w/o the "?"
var postID = filterXSS(window.location.hash.substring(1));//.split("/")[0]; // substring(1) for w/o the "?"
// TODO make firebase function isValidTopicID()
if(!postID) {// || !firebase.auth().currentUser) {
	// Don't wait until the page is loaded to check if the user is authorized to post
	// Ik this is in the client-side, but we'll have authorization sanity checks in the firebase rules (TODO)
	console.log("No postID or no user");
	console.log(`User:  + ${user}`);
	console.log(`TopicID: ${postID}`);
	window.location.assign("/views/error.html");
}


// TODO: some sort of client-side sanitization



$(document).ready(ready => {
	// FIXME once figured out how to fix async auth.js
	// if(!user) {
	// 	console.log('Not logged in');
	// 	window.location.assign("/views/error.html");
	// }
	
	
	getPost(
		postID,
		loadPost,
		(err) => console.log(err)
	);
	
	
	$('#commentForm').submit(submitComment);
	
});


$(window).on('hashchange', (evt) => {
	postID = filterXSS(window.location.hash.substring(1));
	console.log("Hash change triggggggererrereeed: " + postID);
	
	getPost(
		postID,
		loadPost,
		(err) => console.log(err)
	);
});


function getPost(postID, success, failure) {
	return db.ref("Posts")
	.orderByKey().equalTo(postID)	// Awesome filtering magic
	.once("value").then(
		function(snapshot) {
			success(snapshot.val(), postID);
		},
		function(error) {
			failure(error);
		}
	);
}

function loadPost(posts, post) {
	// console.log(posts);
	let frag = document.createDocumentFragment();
	let clone = document.importNode($('#postTemplate')[0].content, true);
	clone.querySelector('td').dataset['id'] = post;
	clone.querySelector('.postLink').href = "/views/post.html#" + post;
	clone.querySelector('.postTitleSpan').innerHTML = filterXSS(posts[post].title);
	clone.querySelector('.postBodySpan').innerHTML = filterXSS(posts[post].body);
	clone.querySelector('.tbAuthor').innerHTML = filterXSS(posts[post].author);
	clone.querySelector('.tbLastEdit').innerHTML = new Date(posts[post].modifiedAt);
	frag.appendChild(clone);
	$('#postGoesHere').append(frag);
}

function submitComment(evt) {
	evt.preventDefault();
	let _body = filterXSS($('textarea[name=commentBody]').val());
	
	let data = {
		parentPostID: postID,
		authorID: user.uid,
		author: user.displayName || "User displayName doesn't exist",
		body: _body,
		createdAt: firebase.database.ServerValue.TIMESTAMP,
		modifiedAt: firebase.database.ServerValue.TIMESTAMP
	};
	
	let pushRef = db.ref("Comments").push();
	pushRef.set(data).then(
		(success) => {
// 			console.log("Successfully posted comment!");
// 			// console.log(success); //undefined
			window.location.assign(`/views/post.html#${postID}`);
		},
		(err) => {
			console.log(err);
			console.log("Comment pushRef error");
			window.location.assign("/views/error.html");
		}
	);
}