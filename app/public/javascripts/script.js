$(document).ready(function() {
  $(document).on("newmessage", function(evt, msg) {
    var el = $("<p>" + msg + "</p>");
    $(".messages").append(el).hide().fadeIn(200);
  });
});
