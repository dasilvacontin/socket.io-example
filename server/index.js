var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var CarrotRadius = 25
var PlayersRadius = 64

var players = {}
var carrots = {}

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)

  for (var playerId in players) {
    var playerPos = players[playerId]
    socket.emit('update_position', playerPos)
  }

  for (var carrotID in carrots) {
    var carrotPos = carrots[carrotID]
    socket.emit('update_carrot_pos', carrotPos)
  }
  
  socket.on('disconnect', function () {
    console.log('disconnection', socket.id)
    delete players[socket.id]
    socket.broadcast.emit('player_disconnected', socket.id)
  })
  socket.on('update_position', function (pos) {
    pos.id = socket.id
    players[socket.id] = pos
    socket.broadcast.emit('update_position', pos)
    
    //comprobar colisiones
    for (var carrotID in carrots) {
      var carrotPos = carrots[carrotID]
      if (dist(carrotPos, pos) < CarrotRadius + PlayersRadius)
        console.log(socket.id+': Numnumnum!')
	}
  })
})

function dist(pos1, pos2) {
	var posN = {
		w: pos2.x - pos1.y,
		h: pos2.y - pos1.y
	}
	return Math.sqrt(posN.w*posN.w + posN.h*posN.h)
}

// INIT Pastanagues
var numCarrots = 3
for (var i = 0; i < numCarrots; ++i) {
	id = i;
	var pos = {
		id: i,
		x: Math.random() * 800,
		y: Math.random() * 600
	}
	carrots[id] = pos
}

console.log('server started on port', port)
