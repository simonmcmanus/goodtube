var tolly = {
	SEARCH_RESULT_CONTAINER : 'mainContent'
};

function searchResultsCallback(data) {
	var html = "";
	for(item in data.feed.entry)
		html += searchItemHtml({
			id: data.feed.entry[item].id.$t,
			title: data.feed.entry[item].title.$t,
			link: data.feed.entry[item].link.$t,
			thumb: data.feed.entry[item].media$group.media$thumbnail[0].url,
			content: data.feed.entry[item].media$group.media$description.$t
		});
  document.getElementById(tolly.SEARCH_RESULT_CONTAINER).innerHTML = html;
}

function searchItemHtml(item) {
	var html = [];
	html.push('<h3>'+item.title+'</h3>');
	html.push('<img src="'+item.thumb+'"/>');
	html.push('<a href="'+item.id+'">link</a>');
	html.push(item.content);
	return html.join('\n');
}

function doSearch(e) {
	appendScriptTag('http://gdata.youtube.com/feeds/videos?max-results=10&start-index=1&vq='+document.getElementById('searchValue').value, 'searchResults', 'searchResultsCallback');
}





// taken from the youtube api example 

var appendScriptTag = function(scriptSrc, scriptId, scriptCallback) {
  // Remove any old existance of a script tag by the same name
  var oldScriptTag = document.getElementById(scriptId);
  if (oldScriptTag) {
    oldScriptTag.parentNode.removeChild(oldScriptTag);
  }
  // Create new script tag
  var script = document.createElement('script');
  script.setAttribute('src', 
      scriptSrc + '&alt=json-in-script&callback=' + scriptCallback);
  script.setAttribute('id', scriptId);
  script.setAttribute('type', 'text/javascript');
  // Append the script tag to the head to retrieve a JSON feed of videos
  // NOTE: This requires that a head tag already exists in the DOM at the
  // time this function is executed.
  document.getElementsByTagName('head')[0].appendChild(script);
};


