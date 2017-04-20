/*
global $
global firebase
global db
global user
global filterXSS
*/
'use strict';
console.log("New Topic JS loaded.");

$(document).ready((ready) => {
	// FIXME once figured out how to fix async auth.js
	// if(!user) {
	// 	console.log('Not logged in');
	// 	window.location.assign("/views/error.html");
	// }
	
	// FIXME
	// $("#postTopic").submit(function(evt){
	// $("#postTopic").click(function(evt){
	$("#postForm").submit(function(evt){
		evt.preventDefault();
	   //UPDATE request
    	// firebase.database().ref('Topics').transaction(count=>{
        let _title = filterXSS($('input[name=topicTitle]').val());
		let _description = filterXSS($('textarea[name=topicDescription]').val());
		
		let data = {
			creator: user.displayName || "No displayName",
			creatorID: user.uid,
			title: _title,
			description: _description,
			createdAt: firebase.database.ServerValue.TIMESTAMP,
			// modifiedAt: firebase.database.ServerValue.TIMESTAMP,
			lastPost: firebase.database.ServerValue.TIMESTAMP
		};
		console.log("Data being sent:");
		console.log(data);
		
		let pushPromise = db.ref("Topics").push();
		pushPromise.set(data).then(
			(success) => {
				console.log("Successfully posted a new topic!");
				// console.log(success); //undefined
				window.location.assign("/views/posts.html#" + pushPromise.key);
			},
			(err) => {
				console.error(err);
				console.log("Topic pushPromise error");
				window.location.assign("/views/error.html");
			});
	    // });
	});



});
    