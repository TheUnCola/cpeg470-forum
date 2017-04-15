/*
global $
global db
*/
'use strict';
console.log("Post Page JS loaded.");

var postID = window.location.hash.substring(1);//.split("/")[0]; // substring(1) for w/o the "?"
// let topicID = undefined;
if(!postID) {// || topicID.match(/(something)/i)) {
	window.location.assign("/views/error.html");
}
// TODO: some sort of sanitization


// var db = firebase.database();

$(document).ready(ready => {
	
	
	getComments(
		postID,
		loadComments,
		(err) => console.log(err)
	);
	
});

$(window).on('hashchange', (evt) => {
	postID = window.location.hash.substring(1);
	console.log("Hash change triggggggererrereeed: " + postID);
	
	$('#commentsGoHere').html("");	// Clear everything first
	getComments(
		postID,
		loadComments,
		(err) => console.log(err)
	);
});

function getComments(postID, success, failure) {
	return db.ref("Comments")
	.orderByChild("parentPostID").equalTo(postID)	// Awesome filtering magic
	.once("value").then(
		function(snapshot) {
			success(snapshot.val());
		},
		function(error) {
			failure(error);
		}
	);
}

function loadComments(comments) {
	console.log(comments);
	
	let frag = document.createDocumentFragment();
	for(let comment in comments) {
		if(comments.hasOwnProperty(comment)) {
			let clone = document.importNode($('#postTemplate')[0].content, true);
			clone.querySelector('td').dataset['id'] = comment;
			clone.querySelector('.commentAuthorSpan').innerHTML = comments[comment].author;
			clone.querySelector('.commentBodySpan').innerHTML = comments[comment].body;
			frag.appendChild(clone);
		}
	}
	$('#commentsGoHere').append(frag);
}