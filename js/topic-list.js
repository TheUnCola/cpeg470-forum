'use strict';
var topicList = angular.module('topicList', ['ngRoute']);

topicList.component('topicList', {
	templateUrl: 'ng/topic-list/topic-list.template.html',
	controller: ['$http', '$routeParams',
		function TopicListController($http, $routeParams) {
			// Maybe do something w/$routeParams
			let self = this;
			
			console.log($routeParams);
			console.log("Topic List CONTROLLER");
			self.topics = [];
			
			// let url = 'https://websec-commandogn.c9users.io/topic';
			// $http.get(url).then(
			// 	(response) => {
			// 		self.response = response.data;// FIXME
			// 		self.topics = response.data.topics;
			// 	},
			// 	(err) => console.log(err)
			// );
		}]
});