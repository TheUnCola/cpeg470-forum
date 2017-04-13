'use strict';
var postList = angular.module('postList', ['ngRoute']);

postList.component('postList', {
	templateUrl: 'ng/post-list/post-list.template.html',
	controller: ['$http', '$routeParams',
		function PostListController($http, $routeParams) {
			// Maybe do something w/$routeParams
			let self = this;
			let topicId = $routeParams.topicid;
			// let topicId = "58d97d00dc97e48813adfd9a";	// FIXME get from window.location?
			//////////////////////////var for user info
			 //this.posts = {
			//	author: "dfad",
			// 	title: "safda",
			// 	body: "fasdfad"
			// };
			 ///////////////////////////////////////
			let url = `https://websec-commandogn.c9users.io/topic/${topicId}`;
			$http.get(url).then(
				(response) => {
					self.response = response.data;// FIXME
					self.posts = response.data.posts;
				},
				(err) => console.log(err)
			);
		}]
});