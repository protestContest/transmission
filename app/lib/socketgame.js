var redis = require('redis');
var rclient = redis.createClient();
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
        text: jade.renderFile(__dirname + '/text/greeting.jade', data),
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: jade.renderFile(__dirname + '/text/mongoose.jade', data),
          request: "command"
        });
      }, 4000);
    break;

    case "command":
      switch (data.text) {
        case "help":
          socket.send({
            text: jade.renderFile(__dirname + '/text/help.jade'),
            request: "command"
          });
        break;

        case "info":
          socket.send({
            text: jade.renderFile(__dirname + '/text/info.jade'),
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
