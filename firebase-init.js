/*
global firebase
*/
// Initialize Firebase
var config = {
	apiKey: "AIzaSyCnThWA3c5D6zpi7Fj9QhehaRCw_jHTzR4",
	authDomain: "cpeg470-forum.firebaseapp.com",
	databaseURL: "https://cpeg470-forum.firebaseio.com",
	projectId: "cpeg470-forum",
	storageBucket: "cpeg470-forum.appspot.com",
	messagingSenderId: "829496000007"
};
firebase.initializeApp(config);

var db = firebase.database();