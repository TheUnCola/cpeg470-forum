// angular.module('topicPage', [
// 	'ngRoute',
// ])
// .component('topicPage', {
// 	templateUrl: 'ng/topic-page/topic-page.template.html',
// 	controller: ['$http', '$routeParams',
// 		function TopicPageController($http, $routeParams) {
// 			let self = this;
			
// 			// console.log("test");
// 			self.topicId = $routeParams.topicid;
			
// 			let url = `https://websec-commandogn.c9users.io/topic/${self.topicId}/posts`;
// 			$http.get(url).then(
// 				(response) => {
// 					self.response = response.data; // FIXME
// 					self.posts = response.data.posts;
					
// 					// console.log(self.posts);
// 				},
// 				(err) => console.log(err)
// 			);
// 		}
// 	]
// });
