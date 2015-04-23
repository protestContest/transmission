module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.send({
      text: "<p>Incoming transmission... please wait.</p>"
    });

    setTimeout(function() {
      socket.send({
        text: "<p>Please identify yourself:</p>",
        request: "name"
      });
    }, 7000);

    socket.on('message', function(data) {
      respond(socket, data);
    });

  });
};

function respond(socket, data) {
  switch(data.requested) {
    case "name":
      socket.send({
        text: "<p>Hello again " + data.text + ".<br>Last login: 2015-04-20 0913 UTC</p> <p>You have (1) new message.</p> <p>New message:</p> <blockquote> <p>2015-04-21 0800 UTC</p> <p>General Memo to Faculty:</p> <p>As you may have heard, there was a minor accident last week in lab A431. We have determined that the incident was the result of failure to observe standard safety practices, which are mandatory for all faculty. Failure to observe standard safety practices will result in disciplinary action.</p> <p>We encourage all faculty to take a moment to review standard safety practices for their lab. If you do not have a copy of your lab's standard safety practices, you can request one from your lab supervisor.</p> <p>A safety crew will investigate lab A431 this week, but we do not believe the incident will impact any other labs. Please disregard rumors to the contrary.</p> <p>Richard Quest<br> Facility Supervisor</p> </blockquote>",
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: "<p>You have (1) new message.</p><p>New message:</p><blockquote> <p>2015-04-22 1806 UTC</p> <p>Hello. I don't know who you are, but thankfully you've gained access to the computer system. I'm a member of the faculty here, and I need your help. You may be in danger, so stay quiet about this. I'll explain more later. I have to go now. I'll contact you again soon. Until then, try to get familiar with the system, but DO NOT MODIFY ANYTHING.</p> <p>-Mongoose</p> </blockquote>",
          request: "_"
        });
      }, 2000);
      break;

    default:
      socket.send({
        text: "<p>Please wait.</p>",
        request: "_"
      });
  }
}