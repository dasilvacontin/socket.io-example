function Player () {
  this.username = 'Unnamed'
  this.color = Math.floor(Math.random() * 0xFFFFFF)
  this.pos = {
    x: 0,
    y: 0
  }
}

Player.prototype.updatePosition = function (pos) {
  this.pos.x = pos.x
  this.pos.y = pos.y
}

Player.prototype.setUsername = function (username) {
  this.username = username.substring(0, 20)
}

module.exports = Player
