// Create new APRI object from ApriBase
if (navigator.online == false) { //always == true ?)
	alert('You are not online. Using this application is not possible. Connect to the internet and then reload the page.');
} else {
	window.APRI = new window.ApriCore.ApriBase;
}
