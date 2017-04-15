/*
global $
global firebase
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
			let clone = document.importNode($('#topicTemplate')[0].content, true);
			clone.querySelector('td').dataset['id'] = topic;
			
			clone.querySelector('.topicLink').href = "views/posts.html#" + topic;
			clone.querySelector('.topicTitleSpan').innerHTML = topics[topic].title;
			// clone.querySelector('.topicCreatorSpan').innerHTML = topics[topic].creator;
			clone.querySelector('.topicDescriptionSpan').innerHTML = topics[topic].description;
			frag.appendChild(clone);
		}
	}
	$('#topicsGoHere').append(frag);
    // Object.keys(topics).forEach(function (key) {
    // 	console.log(topics[key]['description']);
	// $("#topics").find('tbody')
	//     .append($('<tr>')
	//         .append($('<td>')
	//                 .text(topics[key]['description'])
	//             )
	//     );
	// });
}