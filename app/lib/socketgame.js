module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.send({
      text: "Incoming transmission... please wait."
    });

    setTimeout(function() {
      socket.send({
        text: "Please identify yourself:",
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
        text: "Hello again " + data.text + ".",
        request: "_"
      });
      break;

    default:
      socket.send({
        text: "Please wait.",
        request: "_"
      });
  }
}