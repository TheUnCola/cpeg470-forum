// WONT WORK WITH ANGULAR????

$(document).ready(() => {
	
	$('#addPostButton').on('click', addPost);
	
});

// AJAX stuff to the api to add a new post
function addPost(evt){
	console.log("test, not working");
	evt.preventDefault();
	
	/*
	TODO: (SANITIZE)
	*/
	let _author = "TEMPORARY AUTHOR";//(something we've saved from the authentication process? Session variable!(?) )
	let _title = $('#postTitle')[0].value;
	let _body = $('#postBody')[0].value;
	let data = {
		author: _author,
		title: _title,
		body: _body
	};
	
	console.log("Button clicked! Data: ", data);
	// $.post({
	// 	url: 'https://websec-commandogn.c9users.io/topic/:topicId/post',
	// 	data: data,
	// 	success: (result, textStatus, jqXHR) => {
	// 		console.log(result);
	// 	},
	// 	dataType: 'json'
	// });
	
	
	/*
	NOTES:
	For testing purposes, you can just add some html wherever.
	Angular has some magic voodoo data-binding,
		I'm not sure how to work that yet, so we'll probably have to add the new post (when the button's clicked) to the post list manually
		In that case you can use some dope JQuery stuff to load the template (to eventually be moved to its own "post-info" template.
	For now, we can do something like (this won't work, but its the main idea):
	var element  = $("#IDOfPlaceToPutTemplate"); // <post-list>'s <ul> so $('post-list ul')[0]
	var fragment = document.createDocumentFragment();
	fragment.load( "path/to/template.html", function() { //this may not work since it's not a jquery object
		alert( "Load was performed." );
	});
	
	fragment.getElementsByClassName('author')[0].innerHTML = whatever you want to put
	fragment.getElementsByClassName('title')[0].innerHTML = whatever you want to put
	
	element.appendChild(fragment);
	
	//////or don't use the template and just make your own thing and then add it to the <post-list>'s <ul>
	
	*/

}