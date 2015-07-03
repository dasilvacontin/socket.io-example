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
    checkPickupCollision(socket.id)
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

function checkPickupCollision (playerId) {
  var player = players[playerId]
  for (var pickupId in pickups) {
    var pickup = pickups[pickupId]
    if (distPtoP(player, pickup) < 50) {
      io.sockets.emit('collected_pickup', pickup.id)
      console.log('collision with pickup', pickup)
    }
  }
}

function distPtoP (pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
}

console.log('server started on port', port)
