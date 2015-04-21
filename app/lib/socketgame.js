module.exports = function(io) {
  io.on('connection', function(socket) {
    console.log("connected");

    setTimeout(function() {
      console.log("sending message");
      socket.emit('newmessage', 'Hello.');
    }, 2000);

  });
};