/*
global $
global db
global user
*/
'use strict';
console.log("Main Post JS loaded.");

// EXPERIMENTAL (chrome and firefox, maybe safari, no IE)
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
// let x = new URLSearchParams(window.location);
// let x = window.location.search.substring(1); // w/o the "?"
var topicID = window.location.hash.substring(1);//.split("/")[0]; // substring(1) for w/o the "?"
if(!topicID || !user) {// || topicID.match(/(something)/i)) {
	window.location.assign("/views/error.html");
}



// TODO: some sort of sanitization



$(document).ready(ready => {
	
	getTopicTitle(
		topicID,
		loadTopicTitle,
		(err) => console.log(err)
	);
	
	
	$('#postForm').submit((evt) => {
		evt.preventDefault();	
		
		//sanitize stuff
		let _title = $('input[name=postTitle]').val();
		let _body = $('textarea[name=postBody]').val();
		
		let data = {
			parentTopicID: topicID,
			authorId: user.uid,
			author: user.displayName,
			title: _title,
			body: _body
		};
		
		let pushPromise = db.ref("Posts").push();
		pushPromise.set(data).then(
			(success) => {
				console.log("Successfully posted!");
				// console.log(success); //undefined
				// redirect to succesfully posted page, or new post's page (comment page for a post)
				window.location.assign("/views/post.html#" + pushPromise.name());
			},
			(err) => {
				console.log(err);
				window.location.assign("/views/error.html");
			}
		);
	});
	
});


$(window).on('hashchange', (evt) => {
	topicID = window.location.hash.substring(1);
	console.log("Hash change triggggggererrereeed: " + topicID);
	
	getTopicTitle(
		topicID,
		loadTopicTitle,
		(err) => console.log(err)
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
				let title = snapshot.val()[id].title;
				success(title);
			}
			else {
				success("Error");
				return "Error";
			}
		},
		err || function(error) {
			console.log(error);
			window.location.assign("/views/error.html");
		}
	);
}