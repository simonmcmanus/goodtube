twplugin = {}; 

twplugin.createComment = function() {
    var title = "newtiddler";
    var newComment = {
      title: title,
      text: "blah",
      modifier: "simon", // TODO
      tags: ["comment"],
      fields: {
        "server.workspace": "bags/playlists",
        "server.host": "http://127.0.0.1:8288",
        "server.type": "tiddlyweb",
        "server.title": title
      }
    }
   twplugin.putTiddler(newComment);
    return newComment;
  }


twplugin.putTiddler = function(tiddler) {
    $.ajax({type:"POST",
    url: "http://127.0.0.1:8288/"+tiddler.fields["server.workspace"]+"/tiddlers/"+encodeURIComponent(tiddler.title)
         + "?http_method=PUT",
    data: $.toJSON(tiddler),
    contentType: "application/json; charset=UTF-8"
    });
  }
