/*
global $
global db
global filterXSS
*/
'use strict';

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams

console.log("Main JS loaded.");


// Any things (that happen i.e. function calls) that rely on things in the DOM goes in here
$(document).ready(start => {
	
	getTopics(
		loadTopics,
		(error) => console.log(error)
	);
});



function getTopics(success, failure) {
	return db.ref("Topics").once("value").then(
		function(snapshot) {
			success(snapshot.val());
		},
		function(error) {
			failure(error);
		}
	);
}

function loadTopics(topics) {
	console.log(topics);
	
	let frag = document.createDocumentFragment();
	for(let topic in topics) {
		// Note topic is the key
		if(topics.hasOwnProperty(topic)) {
			// console.log("Iterated topic: ", topics[topic]);
			// console.log(topic);
			// console.log(`Topic date: ${topics[topic].lastPost}`);
			let clone = document.importNode($('#topicTemplate')[0].content, true);
			clone.querySelector('td').dataset['id'] = topic;
			
			clone.querySelector('.topicLink').href = "views/posts.html#" + topic;
			clone.querySelector('.topicTitleSpan').innerHTML = filterXSS(topics[topic].title);
			clone.querySelector('.topicDescriptionSpan').innerHTML = filterXSS(topics[topic].description);
			clone.querySelector('.tbLastPost').innerHTML = formatDate(topics[topic].lastPost);
			frag.appendChild(clone);
		}
	}
	$('#topicsGoHere').append(frag);
}