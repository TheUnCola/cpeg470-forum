/*
global $
global db
global filterXSS
*/
'use strict';
console.log("Posts Page JS loaded.");

// EXPERIMENTAL (chrome and firefox, maybe safari, no IE)
// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
// https://www.creativejuiz.fr/blog/en/javascript-en/read-url-get-parameters-with-javascript
// let x = new URLSearchParams(window.location);
// let x = window.location.search.substring(1); // w/o the "?"
var topicID = filterXSS(window.location.hash.substring(1));//.split("/")[0]; // substring(1) for w/o the "?"
// let topicID = undefined;
if(!topicID) {// || topicID.match(/(something)/i)) {
	window.location.assign("/views/error.html");
}
// TODO: some sort of sanitization



$(document).ready(ready => {
	$('#newPostLink').attr('href', `newPost.html#${topicID}`);
	
	getPosts(
		topicID,
		loadPosts,
		(err) => console.log(err)
	);
	
});

$(window).on('hashchange', (evt) => {
	topicID = filterXSS(window.location.hash.substring(1));
	console.log("Hash change triggggggererrereeed: " + topicID);
	
	$('#postsGoHere').html("");	// Clear everything first
	getPosts(
		topicID,
		loadPosts,
		(err) => console.log(err)
	);
});

function getPosts(topicID, success, failure) {
	return db.ref("Posts")
	.orderByChild("parentTopicID").equalTo(topicID)	// Awesome filtering magic
	.once("value").then(
		function(snapshot) {
			success(snapshot.val());
		},
		function(error) {
			failure(error);
		}
	);
}

function loadPosts(posts) {
	// console.log(posts);
	
	let frag = document.createDocumentFragment();
	for(let post in posts) {
		if(posts.hasOwnProperty(post)) {
			let clone = document.importNode($('#postTemplate')[0].content, true);
			clone.querySelector('td').dataset['id'] = post;
			clone.querySelector('.postLink').href = "/views/post.html#" + post;
			clone.querySelector('.postTitleSpan').innerHTML = filterXSS(posts[post].title);
			clone.querySelector('.postBodySpan').innerHTML = filterXSS(posts[post].body);
			clone.querySelector('.tbAuthor').innerHTML = filterXSS(posts[post].author);
			clone.querySelector('.tbLastEdit').innerHTML = formatDate(posts[post].modifiedAt);
			frag.appendChild(clone);
		}
	}
	$('#postsGoHere').append(frag);
}