


function searchItemHtml(item) {
	var html = [];
	html.push('<table><tr><td><img src="'+item.thumb+'"/><br/>');	
	html.push('<a onClick="playlistAdd({ id : \''+item.id+'\', title: \''+item.title+'\',  content: \''+item.content+'\', thumb: \''+item.thumb+'\', link: \''+item.link+'\' })" href="#">add to playlist</a><br/>');
	html.push('<a onClick="findFrags(\''+item.id+'\')" href="#">add this and others </a>');
	html.push('</td><td valign="top">');

	html.push('<h3>'+item.title+'</h3>'+item.content);
	html.push('</td></tr></table><hr/>');

	return html.join('\n');
}

function doSearch(e) {
	appendScriptTag('http://gdata.youtube.com/feeds/videos?max-results=10&start-index=1&vq='+document.getElementById('searchValue').value, 'searchResults', 'searchResultsCallback');
}



function searchResultsCallback(data) {
	var html = "";
	for(item in data.feed.entry)
		html += searchItemHtml({
			id: parseURI(data.feed.entry[item].id.$t),
			title: data.feed.entry[item].title.$t,
			link: data.feed.entry[item].link.$t,
			thumb: data.feed.entry[item].media$group.media$thumbnail[0].url,
			content: data.feed.entry[item].media$group.media$description.$t
		});
  document.getElementById(tolly.CONTENT_DIV).innerHTML = html;	
}

// NOT REVIEWED


/*   Override functions */


ytvb.listVideosCallback = function(data) {
 // Stores the json data returned for later lookup by entry index value
  ytvb.jsonFeed_ = data.feed;
  var resultsTableContainer = document.getElementById(
      ytvb.VIDEO_LIST_TABLE_CONTAINER_DIV);

  // Deletes and re-adds the results table from container
  // NOTE: Any other elements added to the container will also be cleared
  	if(window.showResults != false){
		while (resultsTableContainer.childNodes.length >= 1) {
	    		resultsTableContainer.removeChild(resultsTableContainer.firstChild);
	  		}
	}
  var resultsTable = document.createElement('table');
  resultsTable.setAttribute('class', ytvb.VIDEO_LIST_CSS_CLASS);
  var tbody = document.createElement('tbody');
  resultsTable.setAttribute('width', '100%');
  resultsTableContainer.appendChild(resultsTable);

  // Loops through entries in the feed and calls appendVideoData for each
  for (var i = 0, entry; entry = data.feed.entry[i]; i++) {
    if (! entry.yt$noembed) {
		if(window.showResults != false)
      		ytvb.appendVideoDataToTable(tbody, entry, i);
		var id = parseURI(entry.id.$t);
		if(window.autoQ){
			playlistAdd({id:id, desc:entry.media$group.media$description.$t, title:entry.media$group.media$title.$t });
		}
    }
  }

// used to stop channels showing in search results
if(window.showResults != false)
  resultsTable.appendChild(tbody);
	window.showResults = true;
};




ytvb.showRelatedVideosCallback = function(data) {
	console.log("here", data);
  var relatedVideosDiv = document.getElementById(ytvb.RELATED_VIDEOS_DIV);
  ytvb.jsonFeedRelated_ = data.feed;
  for (var i= 0, entry; entry = data.feed.entry[i]; i++) {
    relatedVideosJson = entry; 
    var img = document.createElement('img');
    img.setAttribute('src', entry.media$group.media$thumbnail[0].url);
    img.onclick = ytvb.generatePlayVideoLinkOnclick(entry.id.$t, i, 
        ytvb.REFERRING_FEED_TYPE_RELATED);
    img.setAttribute('width', ytvb.THUMBNAIL_WIDTH);
    img.setAttribute('height', ytvb.THUMBNAIL_HEIGHT);
    relatedVideosDiv.appendChild(img);
	var id = parseURI(entry.id.$t);
//	if(window.qRelated)
		playlistAdd({id:id, desc:entry.media$group.media$description.$t, title:entry.media$group.media$title.$t });
		
		//playlistAdd(id);

  }
};





/*  States :

5 : page just loaded - not playing 
4 : 
3 : play clicked
2 : paused
1 : playing
0 : stopped  / Loading new vid?

*/
function onytplayerStateChange(newState) {
	if(newState==0){
		if(window.playRequest==true)
			window.playRequest = false;
		else
			playlistNext();
	}				
}


// functions for the api calls
function loadNewVideo(id, startSeconds) {
  if (ytplayer) {
	if( ytplayer.getPlayerState() == 1) {
		console.log("something is already playing ... adding to playlist");
		playlistAdd(id);
	} else {
    	ytplayer.loadVideoById(id, parseInt(startSeconds));
	}
  }
}

/*  PLAYLIST FUNCTIONS */

parseURI = function(uri) {
	temp = uri.split('/');
	return temp[temp.length-1];
}


function playlistAdd(item) {
	var id = "";
	if(typeof item == "object")
		id = item.id;
	else 
		id = item;
	
	if(window.doNotQ == undefined)
		window.doNotQ = {};
	if(window.doNotQ[id] != undefined){
		$.jGrowl("item has already been played.", { sticky: false });
		return false;		
	}
	if(ytplayer.getPlayerState()==1 || ytplayer.getPlayerState()==0 || ytplayer.getPlayerState()==3 || ytplayer.getPlayerState() ==5) {
		if(tolly.playlist == undefined)
			tolly.playlist = [];	
		tolly.playlist[jp.length] = item;
		updatePlaylist();		
	}else{
		loadNewVideo(id);
	}

	window.doNotQ[id] = item;
}



//  AutoQ functions 

function setAutoQ(checkbox) {
	window.autoQ = checkbox.checked;
}



function settingsClick() {
	if($("#settings").css('display') == 'none' )
		$("#settings").show();
	else
		$("#settings").hide();
}



//  TV CHANNEL FUNCTIONS 


function playChannel(feed) {
	tolly.playlist = [];
	window.showResults = false;
	window.autoQ = true;
	ytvb.MAX_RESULTS_LIST = 50;
	ytvb.listVideos(feed, "", 1);
	$(".loadingImg").hide();	
	$("#"+feed+"LoadingImg").show();

}


function listChannels() {
	var html = [];
	var count = 0;
	for (var i in ytvb.QUERY_URL_MAP){
		if(count >=3)
			count = 0;
		count ++;
		
	$("#channelsCol"+count).html($("#channelsCol"+count).html()+'<div class="channelButton" id="'+i+'Button" onclick=playChannel("'+i+'");>'+i.replace("_", " ")+' <img height="20px"  class="loadingImg" id="'+i+'LoadingImg" src="/static/tolly/ajax-loader.gif" /></div>');	
	}
}

function viewPlayed() {
	tolly.playlist.unshift(tolly.playlistPast[0]);
	tolly.playlist.shift();
	updatePlaylist();
};

function stripFirstBracket(string) {
	return string.substring(0, string.indexOf('Part'));
}

function findOtherFragmentsCallback(data) {
	var fragTitles = [];
	var titleIDLookUp = {};
	for (var i= 0, entry; entry = data.feed.entry[i]; i++) {
		if(stripFirstBracket(entry.title.$t) == stripFirstBracket(tolly.title)) {
			fragTitles[fragTitles.length++] = entry.title.$t;
			titleIDLookUp[entry.title.$t] = entry.id.$t;
		}		
	}
	fragTitles = fragTitles.sort();
console.log("b is", titleIDLookUp);
	for(var c = 0; fragTitles.length > c; c++){
		playlistAdd({id:parseURI(titleIDLookUp[fragTitles[c]]),title: fragTitles[c]});

	}



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



// PLAYLIST FUNCTIONS : 



var playlistAdd = function(item) {
	// check if required fields have been set
	tolly.playlist[tolly.playlist.length] = item;	
	updatePlaylist();
}


function playlistNext() {
	if(window.jpPast == undefined)
		window.jpPast = [];
	loadNewVideo(window.jp[0].id);
	$("#sortable > #"+0).fadeOut("fast");
	window.jp.shift();
	jpPast[window.jp[0].id] = window.jp[0];
	jpPast.push(window.jp[0]);
	updatePlaylist();
//$("#sortable > #"+0).prependTo('#pastPlaylist')
	
}

function updatePlaylist() {
	document.getElementById("sortable").innerHTML = playlistPresent(tolly.playlist);		
	setMouseOver();
	document.getElementById("pastPlaylist").innerHTML = playlistPresent(window.jpPast);		
}

function playlistDelete(position) {
	window.jp.splice(position, 1);
	$("#sortable > #li_"+position).fadeOut("slow");	
}

function playlistPlay(id) {
	window.playRequest = true;
	ytplayer.loadVideoById(id, 0);
}

function setMouseOver() {	
	$(".ui-state-default").mouseover(function() {
		$("#more_info_"+this.firstChild.id).show();
	});
	$(".ui-state-default").mouseout(function() {
		$("#more_info_"+this.firstChild.id).hide();
	});

}

function playlistPresent(p) {
	if(p!=undefined) {
		var items = p;
		var html = [];
		for(i = 0; i < items.length; i++){
			if(items[i]!=="" && items[i]!==undefined) {
				var img = "http://i.ytimg.com/vi/"+items[i].id+"/2.jpg";
				html.push('<li id="li_'+i+'" class="ui-state-default"><img src="'+img+'" class="playlistItem" id="'+items[i].id+'" width="90"/>');
				html.push('<a href="#" class="playlistPlay"  onclick="playlistPlay(\''+items[i].id+'\');">');
				html.push('<img src="http://i250.photobucket.com/albums/gg259/usedguitarsonline/Play_Icon_by_AI74.png" height="20px"</a><br />');
				html.push('<a href="#" class="playlistDelete" alt="remove video from playlist" onclick="playlistDelete('+i+')"><img src="http://dryicons.com/images/icon_sets/simplistica/png/128x128/delete.png" height="20px">');
				html.push('</a><div class="playlistItemInfo" id="more_info_'+items[i].id+'" style="display:none"><h4>'+items[i].title+"</h4><p>"+items[i].desc+'</p></div></li>');
			}
		}
		return html.join("");		
	}	
}

function getPlaylist(name) {
	$.get("playlists/"+name+".txt", function(data) {
		var items = eval("{"+data+"}");
		for(i = 0; i < items.length; i++){
			playlistAdd(items[i].id);
		}
	});
}


function findFrags(id) {
    ytvb.appendScriptTag("http://gdata.youtube.com/feeds/api/videos/"+id+"/related?a=1", 
      'showVideosByUserfScript', 
      'findOtherFragmentsCallback');
}


/*

when viewing replated items the title of the original item is provided in the format : 
Videos related to ' TITLE HERE '
This function is used to extract the title
*/
function removeRelatedText(string) {
	var s = string.replace("Videos related to '", "");
	s.substring(0, s.length-1);
	return s;
}	

function stripFirstBracket(string) {
	return string.substring(0, string.indexOf('Part'));
}

function findOtherFragmentsCallback(data) {
	var currentTitle =  removeRelatedText(data.feed.title.$t);
	var fragTitles = [];
	var titleIDLookUp = {};
	for (var i= 0, entry; entry = data.feed.entry[i]; i++) {
		if(stripFirstBracket(entry.title.$t) == stripFirstBracket(currentTitle)) {
			fragTitles[fragTitles.length++] = entry.title.$t;
			titleIDLookUp[entry.title.$t] = entry.id.$t;
		}		
	}
	fragTitles = fragTitles.sort();
console.log("b is", titleIDLookUp);
	for(var c = 0; fragTitles.length > c; c++){
		playlistAdd({id:parseURI(titleIDLookUp[fragTitles[c]]),title: fragTitles[c]});

	}



}


