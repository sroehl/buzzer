var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

var url = require('url');

var rooms = new Array();
var buzzed = 0;

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
   if(!(buzzed)){
    buzzed=1;
    console.log("buzzed");
    var nick;
    io.sockets.sockets[socket.id].get('nickname', function(err, nickname) {
        nick=nickname;
        console.log(nick);
    });
    io.sockets.in(room).emit('buzzed',nick);
   }
  });

socket.on('subscribe', function(roomId,user) { 
       if(typeof rooms[room] != 'undefined'){
         console.log(typeof rooms[room]);
         removeUser();
       }
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
    io.sockets.in(room).emit('users',rooms[room]);
 });

socket.on('disconnect', function (){
  if(typeof rooms[room] != 'undefined'){
    removeUser();
  }
});


socket.on('getUser',function(){
  io.sockets.in(room).emit('users',rooms[room]);
});


  socket.on('clear', function()  {
    buzzed=0;
    io.sockets.in(room).emit('clearCanvas');
  });

function removeUser(){
  io.sockets.sockets[socket.id].get('nickname', function(err,user){
    var index=rooms[room].indexOf(user);
    rooms[room].splice(index,1);
  });
  io.sockets.in(room).emit('users',rooms[room]);
}


});

