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

module.exports = Player
