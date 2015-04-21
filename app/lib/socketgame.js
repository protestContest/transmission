module.exports = function(io) {
  io.on('connection', function(socket) {
    setTimeout(function() {
      console.log("sending message");
      socket.send({
        text: "Please identify yourself:",
        request: "name"
      });
    }, 2000);

    socket.on('message', function(data) {
      respond(socket, data);
    });

  });
};

function respond(socket, data) {
  switch(data.requested) {
    case "name":
      socket.send({
        text: "Authorized. You have no new messages.",
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