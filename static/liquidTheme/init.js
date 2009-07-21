
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
  
  $(document).ready(function(){
   window.tollyPP = [];
  // window.tollyPP = $.cookie('tollyPlaylistInfo');  
      $.jGrowl.defaults.closer = false;
    window.autoQ = false;
    document.getElementById(ytvb.MAIN_SEARCH_CONTAINER_DIV).style.display = 'none';
    document.getElementById(ytvb.TOP_SEARCH_CONTAINER_DIV).style.display = 'inline';
    $("#resultsNumberSliderResult").html(ytvb.MAX_RESULTS_LIST);
    $("#resultsNumberSlider").slider({
      max: 50,
      min:1,
      value:ytvb.MAX_RESULTS_LIST,
      stop: function(e, s) {
      ytvb.MAX_RESULTS_LIST = s.value;
      $("#resultsNumberSliderResult").html(s.value);
    } });
    listChannels();
   });
 
  var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
  document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
 
  try {
  var pageTracker = _gat._getTracker("UA-530421-2");
  pageTracker._trackPageview();
  } catch(err) {}
  
