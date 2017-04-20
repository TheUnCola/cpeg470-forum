/*
global $
global db
global user
global filterXSS
*/
'use strict';
console.log("Post Page JS loaded.");

var postID = filterXSS(window.location.hash.substring(1));//.split("/")[0]; // substring(1) for w/o the "?"
// let topicID = undefined;
if(!postID) {// || topicID.match(/(something)/i)) {
	window.location.assign("/views/error.html");
}
// TODO: some sort of sanitization


// var db = firebase.database();

$(document).ready(ready => {
	$('#newCommentLink').attr('href', `newComment.html#${postID}`);
	
	getPost(
		postID,
		loadPost,
		err => console.log(err)
	);
	
	getComments(
		postID,
		loadComments,
		(err) => console.log(err)
	);
	
});

$(window).on('hashchange', (evt) => {
	postID = filterXSS(window.location.hash.substring(1));
	console.log("Hash change triggggggererrereeed: " + postID);
	
	$('#postGoesHere').html("");
	getPost(postID, loadPost, err => console.log(err));
	
	$('#commentsGoHere').html("");	// Clear everything first
	getComments(
		postID,
		loadComments,
		(err) => console.log(err)
	);
});


function getPost(postID, success, failure) {
	return db.ref("Posts")
	.orderByKey().equalTo(postID)	// Awesome filtering magic
	.once("value").then(
		function(snapshot) {
			console.log(snapshot.val());
			success(snapshot.val(), postID);
		},
		function(error) {
			failure(error);
		}
	);
}

function loadPost(posts, post) {
	console.log(posts);
	
	$('#bcPosts').attr('href', `/views/posts.html#${posts[post].parentTopicID}`);
	let frag = document.createDocumentFragment();
	let clone = document.importNode($('#postTemplate')[0].content, true);
	clone.querySelector('td').dataset['id'] = post;
	clone.querySelector('.postLink').href = `/views/post.html#${post}`;
	clone.querySelector('.postTitleSpan').innerHTML = filterXSS(posts[post].title);
	clone.querySelector('.postBodySpan').innerHTML = filterXSS(posts[post].body);
	clone.querySelector('.tbAuthor').innerHTML = filterXSS(posts[post].author);
	clone.querySelector('.tbLastEdit').innerHTML = formatDate(posts[post].modifiedAt);
	
	// console.log(`authorID: ${posts[post].authorID}`);
	// console.log(`userID: ${user.uid}`);
	// console.log(`Loose match?: ${posts[post].authorID == user.uid}`);
	// console.log(`Strict match?: ${posts[post].authorID === user.uid}`);
	// console.log("authorID == user.uid: " + (posts[post].authorID === user.uid));
	// console.log(clone.querySelector('#editPostButton').classList);
	if(!!user && posts[post].authorID === user.uid) {
		console.log("authorID == user.uid: " + (posts[post].authorID === user.uid));
		let b = clone.querySelector('#editPostButton');
		b.classList.toggle('hidden');
		b.href = `/views/editPost.html#${postID}`;
	}
	
	frag.appendChild(clone);
	$('#postGoesHere').append(frag);
}

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
			let clone = document.importNode($('#commentTemplate')[0].content, true);
			clone.querySelector('td').dataset['id'] = comment;
			clone.querySelector('.commentAuthorSpan').innerHTML = filterXSS(comments[comment].author);
			clone.querySelector('.commentBodySpan').innerHTML = filterXSS(comments[comment].body);
			// createdAt: firebase.database.ServerValue.TIMESTAMP
			frag.appendChild(clone);
		}
	}
	$('#commentsGoHere').append(frag);
}