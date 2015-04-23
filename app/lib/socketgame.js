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
    loadUser(rclient, data.name, function(user) {
      switch(data.requested) {
        case "command":
          switch (data.text) {
            case "help":
              socket.send({
                text: jade.renderFile(__dirname + '/text/help.jade', {user: user}),
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
              var dates = (new Messages(new Date(user.start))).getDates();

              socket.send({
                text: jade.renderFile(__dirname + '/text/messages.jade', {dates: dates}),
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
    });
  }
}

function checkNewPlayer(rclient, name, next) {
  rclient.exists(name, function(err, exists) {
    if (!exists) {
      resetUser(rclient, name, next);
    } else {
      loadUser(rclient, name, next);
      rclient.hset(name, "lastLogin", (new Date()).toISOString());
    }
  });
}

function loadUser(rclient, name, next) {
  rclient.hgetall(name, function(err, user) {
    next(user);
  });
}

function levelUp(rclient, name, next) {
  rclient.hincrby(name, "level", 1, function(err) {
    if (next) { next(); }
  });
}

function resetUser(rclient, name, next) {
  var now = new Date();
  var oneDayMs = 24*60*60*1000;

  var user = {
    name: name,
    level: '0',
    start: now.toISOString(),
    lastLogin: (new Date(now - 30*oneDayMs)).toISOString()
  };

  rclient.hmset(name, user, function(err) {
    if (next) { next(user); }
  });
}

function goToLevel(socket, rclient, level, user) {
  var messages = new Messages(new Date(user.start));
  var tvars = {
    user: user,
    dates: messages.getDates()
  };

  switch(level) {
    case '0':
      socket.send({
        text: jade.renderFile(__dirname + '/text/greeting.jade', tvars)
            + jade.renderFile(__dirname + '/text/message1.jade', tvars),
        request: "_"
      });

      setTimeout(function() {
        socket.send({
          text: jade.renderFile(__dirname + '/text/mongoose.jade', tvars),
          request: "command"
        });

        levelUp(rclient, user.name);
      }, messages.timeouts.mongoose1 * 1000);
    break;

    case '1':
      socket.send({
        text: jade.renderFile(__dirname + '/text/greeting.jade', tvars)
            + jade.renderFile(__dirname + '/text/messages.jade', tvars),
        request: "command"
      });
    break;

    default:
      resetUser(rclient, user.name);
  }
}

function Messages(startDate) {
  var oneDayMs = 24*60*60*1000;

  this.timeouts = {
    mongoose1: 5
  };

  this.getDates = function() {
    var quest1Date = new Date(startDate - oneDayMs);
    quest1Date.setUTCHours(8, 0, 0, 0);

    var mongoose1Date = new Date(startDate.valueOf());
    mongoose1Date.setUTCSeconds(startDate.getUTCSeconds() + this.timeouts.mongoose1);

    return {
      quest1: quest1Date,
      mongoose1: mongoose1Date
    };
  };
}
