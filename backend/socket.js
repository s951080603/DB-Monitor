const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', (data) => {
    console.log(`Received message: ${data}`);
    io.emit('message', data);
  });
});

http.listen(8080, () => {
  console.log(`listening on 8080`);
});