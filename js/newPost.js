/*
global $
global firebase
global db
global user
global filterXSS
*/
'use strict';
console.log("New Post JS loaded.");

// EXPERIMENTAL (chrome and firefox, maybe safari, no IE)
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
// let x = new URLSearchParams(window.location);
// let x = window.location.search.substring(1); // w/o the "?"
var topicID = filterXSS(window.location.hash.substring(1))//.split("/")[0]; // substring(1) for w/o the "?"
// TODO make firebase function isValidTopicID()
if(!topicID) {// || !firebase.auth().currentUser) {
	// Don't wait until the page is loaded to check if the user is authorized to post
	// Ik this is in the client-side, but we'll have authorization sanity checks in the firebase rules (TODO)
	console.log("No topicID or no user");
	console.log(`User:  + ${user}`);
	console.log(`TopicID: ${topicID}`);
	window.location.assign("/views/error.html");
}



// TODO: some sort of client-side sanitization



$(document).ready(ready => {
	// FIXME once figured out how to fix async auth.js
	// if(!user) {
	// 	console.log('Not logged in');
	// 	window.location.assign("/views/error.html");
	// }
	
	getTopicTitle(
		topicID,
		loadTopicTitle//,
		// (err) => console.log(err)
	);
	
	
	$('#postForm').submit((evt) => {
		evt.preventDefault();
		
		//sanitize stuff
		let _title = filterXSS($('input[name=postTitle]').val());
		let _body = filterXSS($('textarea[name=postBody]').val());
		
		let data = {
			parentTopicID: topicID,
			authorID: user.uid,
			author: user.displayName || "No Display Name Provided",
			title: _title,
			body: _body,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			modifiedAt: firebase.database.ServerValue.TIMESTAMP
		};
		
		let pushRef = db.ref("Posts").push();
		pushRef.set(data).then(
			(success) => {
				db.ref("Topics").child(data.parentTopicID).update({'lastPost': data.createdAt});
				
				console.log("Successfully posted!");
				// console.log(success); //undefined
				// redirect to succesfully posted page, or new post's page (comment page for a post)
				window.location.assign("/views/post.html#" + pushRef.key);
			},
			(err) => {
				console.log(err);
				console.log("Post pushRef error");
				window.location.assign("/views/error.html");
			}
		);
	});
	
});


$(window).on('hashchange', (evt) => {
	topicID = filterXSS(window.location.hash.substring(1));
	console.log("Hash change triggggggererrereeed: " + topicID);
	
	getTopicTitle(
		topicID,
		loadTopicTitle//,
		// (err) => console.log(err)
	);
});

function loadTopicTitle(title) {
	console.log(title);
	$('#topicTitle').html(title);
}

function getTopicTitle(id, success, err) {
	// make sure id is a string
	
	return db.ref('Topics')
	.orderByKey().equalTo(id)	// Awesome filtering magic
	.once("value").then(
		(snapshot) => {
			if(!!snapshot.val()) {
				// console.log(snapshot);
				// console.log(snapshot.val());
				// console.log(snapshot.val()[id]);
				let title = filterXSS(snapshot.val()[id].title);
				success(title);
			}
			else {
				success("Error");
				return "Error";
			}
		},
		err || function(error) {
			console.log(error);
			console.log("Couldn't get topic title");
			window.location.assign("/views/error.html");
		}
	);
}