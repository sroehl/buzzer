var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8999);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
   console.log(__dirname);

    res.writeHead(200);
    res.end(data);
  });
}


io.sockets.on('connection', function (socket) {
  var room;
  socket.on('draw', function(x,y)  {
    console.log(x,y);
    io.sockets.in(room).emit('sdraw',x,y);
  });

socket.on('subscribe', function(data) { socket.join(data); room=data;})

});

