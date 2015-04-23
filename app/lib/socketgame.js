var jade = require('jade');

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
        text: jade.render("text/greeting", data),
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: "<p>You have (1) new message.</p><p>New message:</p><blockquote> <p>2015-04-22 1806 UTC</p> <p>Hello. I don't know who you are, but thankfully you've gained access to the computer system. I'm a member of the faculty here, and I need your help. You may be in danger, so stay quiet about this. I'll explain more later. I have to go now. I'll contact you again soon. Until then, try to get familiar with the system, but DO NOT MODIFY ANYTHING.  (Try `help` if you're new to the SCN.)</p> <p>-Mongoose</p> </blockquote>",
          request: "command"
        });
      }, 4000);
    break;

    case "command":
      switch (data.text) {
        case "help":
          socket.send({
            text: "<p>You are connected to the TCS D8303 Scientific Computer Network.<br> You are logged on as Zack</p> <p>Warning: Your account has been limited to essential operations. See your administrator for assistance.</p> <p>Commands:</p> <code>exit  info  logs  messages</code>",
            request: "command"
          });
        break;

        case "info":
          socket.send({
            text: "<p>You are connected to a TCS D8303 Scientific Computer Network.</p> <p>The D8303 SCN is a state-of-the-art computer system by Tracon Computer Systems. It uses the latest in computing research to harness the power of quantum physics, allowing researchers to solve yet-unsolvable classes of scientific problems.</p> <p>This installation of the D8303 SCN is licensed to:</p> <pre>  INDUSTRIAL SCIENCE INC.</pre> ",
            request: "command"
          });
        break;

        case "logs":
          socket.send({
            text: "<p>Access denied.</p>",
            request: "command"
          });
        break;

        case "messages":
          socket.send({
            text: "<p>You have (2) messages.</p> <ol> <li>2015-04-22 1806 UTC | Hello. I don't know who you are, but thankfully you've</li> <li>2015-04-21 0800 UTC | General Memo to Faculty:</li></ol>",
            request: "command"
          });
        break;
      }
    break;

    default:
      socket.send({
        text: "<p>Please wait.</p>",
        request: "_"
      });
  }
}