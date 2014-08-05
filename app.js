var socketio = require('socket.io');
var static = require('node-static');

var file = new static.Server('./');

var app = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
})
app.listen(8080);

var io = socketio(app);

io.on('connection', function (socket) {
  socket.on('sensorSend', function (data) {
    console.log(data);
    socket.broadcast.emit('sensorReceive', data);
  });
});
