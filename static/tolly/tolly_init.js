
  $(function() {
    $("#sortable").sortable({
      helper: 'clone',
      opacity:'0.8',
      update: function(event, ui) {
        var p = [];
        $(this).children().each(function() {
          if(this.firstChild!=undefined)
            p.push(this.firstChild.id);
        });
        window.playlist = p.join("\n");
    }});
    $("#sortable").disableSelection();
  });


