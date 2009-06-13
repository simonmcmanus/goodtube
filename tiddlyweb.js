twplugin = {}; 

twplugin.createComment = function() {
    var title = "new tiddler";
    var newComment = {
      title: title,
      text: "blah",
      modifier: "guest", // TODO
      tags: ["comment"],
      fields: {
        "server.workspace": "bags/comments",
        "server.host": "ROOT",
        "server.type": "tiddlyweb",
        "server.title": title
      }
    }
   twplugin.putTiddler(newComment);
    return newComment;
  }


twplugin.putTiddler = function(tiddler) {
    $.ajax({type:"POST",
    url: "/"+tiddler.fields["server.workspace"]+"/tiddlers/"+encodeURIComponent(tiddler.title)
         + "?http_method=PUT",
/*
    $.ajax({type:"PUT",
    url: ROOT+"/"+tiddler.fields["server.workspace"]+"/tiddlers/"+tiddler.title,
*/
    data: $.toJSON(tiddler),
    contentType: "application/json; charset=UTF-8"
    });
  }
