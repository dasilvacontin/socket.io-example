var port = process.env.PORT || 9000
var io = require('socket.io')(port)

var MAP_WIDTH = 800
var MAP_HEIGHT = 600

var players = {}
var pickups = {}

io.on('connection', function (socket) {
  socket.broadcast.emit('hi')
  console.log('connection', socket.id)

  for (var playerId in players) {
    var playerPos = players[playerId]
    socket.emit('update_position', playerPos)
  }
  //socket.emit('init_players', players)

  socket.emit('init_pickups', pickups)

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

var pickupCount = Math.floor(Math.random() * 30 + 10)
for (var i = 0; i < pickupCount; ++i) {
  var pickup = {
    id: i,
    x: Math.floor(Math.random() * MAP_WIDTH),
    y: Math.floor(Math.random() * MAP_HEIGHT)
  }
  pickups[pickup.id] = pickup
}

console.log('server started on port', port)
