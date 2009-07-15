var homepageTiddlerCallback = function(responseText) {
	var data = eval(responseText);
	for(entry in data)
		console.log(data[entry].title);
}
$(document).ready(function(){
	$.get('/bags/homepage/tiddlers.json', null, homepageTiddlerCallback)
});
 

