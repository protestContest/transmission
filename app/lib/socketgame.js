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
      respond(socket, rclient, data);
    });

  });
};

function respond(socket, rclient, data) {
  switch(data.requested) {
    case "name":
      data.name = data.text;
      checkNewPlayer(rclient, data.name, function(level) {
        goToLevel(socket, rclient, level, data);
      });
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
            text: jade.renderFile(__dirname + '/text/messages.jade'),
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

function checkNewPlayer(rclient, name, next) {
  rclient.exists(name, function(err, exists) {
    if (!exists) {
      resetLevel(rclient, name, function() {
        next('0');
      });
    } else {
      rclient.hget(name, "level", function(err, level) {
        next(level);
      });
    }
  });
}

function levelUp(rclient, name, next) {
  rclient.hincrby(name, "level", 1, function(err) {
    if (next) { next(); }
  });
}

function resetLevel(rclient, name, next) {
  rclient.hset(name, "level", '0', function(err) {
    if (next) { next(); }
  });
}

function goToLevel(socket, rclient, level, data) {
  switch(level) {
    case '0':
      socket.send({
        text: jade.renderFile(__dirname + '/text/greeting.jade', data),
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: jade.renderFile(__dirname + '/text/mongoose.jade', data),
          request: "command"
        });

        levelUp(rclient, data.name);
      }, 4000);
    break;

    case '1':
      socket.send({
        text: jade.renderFile(__dirname + '/text/messages.jade', data),
        request: "command"
      });
    break;

    default:
      resetLevel(rclient, data.name);
  }
}