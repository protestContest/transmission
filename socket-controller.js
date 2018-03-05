module.exports = (io) => {
  io.on('connection', socket => {
    socket.send('welcome');
  });
}
