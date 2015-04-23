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
  if (data.requested === "name") {
    socket.name = data.text;
    checkNewPlayer(rclient, data.text, function(user) {
      goToLevel(socket, rclient, user.level, user);
    });    
  } else {
    var user = loadUser(data.name);

    switch(data.requested) {
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
}

function checkNewPlayer(rclient, name, next) {
  rclient.exists(name, function(err, exists) {
    if (!exists) {
      resetUser(rclient, name, next);
    } else {
      rclient.hgetall(name, function(err, user) {
        next(user);
        rclient.hset(name, "lastLogin", (new Date()).toISOString());
      });
    }
  });
}

function levelUp(rclient, name, next) {
  rclient.hincrby(name, "level", 1, function(err) {
    if (next) { next(); }
  });
}

function resetUser(rclient, name, next) {
  var now = new Date();
  var dayMS = 24*60*60*1000;

  var user = {
    name: name,
    level: '0',
    start: now.toISOString(),
    lastLogin: (new Date(now - 30*dayMS)).toISOString()
  };

  rclient.hmset(name, user, function(err) {
    if (next) { next(user); }
  });
}

function goToLevel(socket, rclient, level, user) {
  switch(level) {
    case '0':
      socket.send({
        text: jade.renderFile(__dirname + '/text/greeting.jade', user)
            + jade.renderFile(__dirname + '/text/message1.jade', user),
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: jade.renderFile(__dirname + '/text/mongoose.jade', user),
          request: "command"
        });

        levelUp(rclient, user.name);
      }, 4000);
    break;

    case '1':
      socket.send({
        text: jade.renderFile(__dirname + '/text/greeting.jade', user)
            + jade.renderFile(__dirname + '/text/messages.jade', user),
        request: "command"
      });
    break;

    default:
      resetUser(rclient, user.name);
  }
}