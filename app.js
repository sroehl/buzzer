var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var url = require('url');

var rooms = new Array();

app.listen(8999);

function handler (req, res) {
  var path = url.parse(req.url).pathname;
  var fsCallback = function (err, data) {
    if (err) throw error;
      res.writeHead(500);
      res.write(data);
      res.end();
    }

   console.log(path);
  switch(path){
    case '/teacher':
      doc=fs.readFile(__dirname + '/teacher.html',fsCallback);
      break;
   default:
     doc=fs.readFile(__dirname + '/student.html',fsCallback);
    break;
  }
}


io.sockets.on('connection', function (socket) {
  var room;
  socket.on('buzz', function()  {
    console.log("buzzed");
    var nick;
    io.sockets.sockets[socket.id].get('nickname', function(err, nickname) {
        nick=nickname;
        console.log(nick);
    });
    io.sockets.in(room).emit('buzzed',nick);
  });

socket.on('subscribe', function(roomId,user) { 
      socket.leave(room);
       socket.join(roomId); 
       room=roomId;
       socket.set('nickname',user);
       console.log('joined');

      if(typeof rooms[room] === 'undefined'){
        rooms[room] = new Array();
        rooms[room].push(user);
      }else{
        rooms[room].push(user);
      }
 });


  socket.on('clear', function()  {
    io.sockets.in(room).emit('clearCanvas');
  });


});

