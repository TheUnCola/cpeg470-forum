function formatDate(_date) {
	let date = new Date(_date);
	let monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	];
	
	let day = date.getDate();
	let monthIndex = date.getMonth();
	let year = date.getFullYear();
	let minutes = '0';
	if(date.getMinutes() > 9) minutes = date.getMinutes();
	else minutes = '0' + date.getMinutes();
	let time = '0';
	if(date.getHours() > 12) time = date.getHours()-12 + ':' + minutes + ' pm';
	else time = date.getHours() + ':' + minutes + ' pm';
	
	return monthNames[monthIndex] + ' ' + day + ' ' + year + ' ' + time;
}