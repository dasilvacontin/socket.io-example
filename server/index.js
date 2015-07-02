var port = process.env.PORT || 9000
var io = require('socket.io')(port)

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
  })
})

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
