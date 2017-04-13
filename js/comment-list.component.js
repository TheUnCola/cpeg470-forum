'use strict';
var forumApp =
angular.module('commentList')
.component('commentList', {
	templateUrl: 'js/ng/comment-list/comment-list.template.html',
	controller: ['$http', '$routeParams',
		
		function IDoShit($http, $routeParams) {
			// do fun AJAX here
			// Maybe do something w/$routeParams
			
			let self = this;
			let topicId = "58d97d00dc97e48813adfd9a";	// FIXME use routeParams
			let postId = "58d9e46223eadb7129be88c7";	// FIXME use routeParams
			
			let url = `https://websec-commandogn.c9users.io/topic/${topicId}/comments/${postId}`;
			$http.get(url).then(
				(response) => {
					self.comments = response.data; // FIXME
				},
				(err) => console.log(err)
			);
			
			
		}
	]
});