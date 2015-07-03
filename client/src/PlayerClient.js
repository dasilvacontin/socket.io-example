var Player = require('../../shared/Player.js')
var KeyboardJS = require('./Keyboard.js')

var keyboard = new KeyboardJS(false)

var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
var bunnySpeed = 5

function PlayerClient () {
  Player.call(this)
  this.generateSprite()
}

PlayerClient.prototype = new Player()
PlayerClient.prototype.constructor = PlayerClient

PlayerClient.prototype.generateSprite = function () {
  this.sprite = new PIXI.Sprite(bunnyTexture)
  this.sprite.tint = this.color
  this.pos = this.sprite.position
  this.updatePosition({
    x: Math.floor(Math.random() * 800),
    y: Math.floor(Math.random() * 600)
  })
  this.sprite.anchor.set(0.5, 0.5)

  this.usernameSprite = new PIXI.Text(this.username)
  this.usernameSprite.style = {font: "30px Snippet", fill: "white"}
  this.usernameSprite.anchor.set(0.5, 0)
  this.usernameSprite.position.y = 70
  this.sprite.addChild(this.usernameSprite)
}

PlayerClient.prototype.setUsername = function (username) {
  Player.prototype.setUsername.call(this, username)
  this.usernameSprite.text = this.username
}

PlayerClient.prototype.setColor = function (color) {
  this.color = color
  this.sprite.tint = color
}

PlayerClient.prototype.moveUsingInput = function () {
  var oldPos = this.pos.clone()

  if (keyboard.char('W')) this.pos.y -= bunnySpeed
  if (keyboard.char('A')) this.pos.x -= bunnySpeed
  if (keyboard.char('D')) this.pos.x += bunnySpeed
  if (keyboard.char('S')) this.pos.y += bunnySpeed

  return (oldPos.x != this.pos.x || oldPos.y != this.pos.y)
}

PlayerClient.prototype.generatePacket = function () {
  var packet = {
    username: this.username,
    color: this.color,
    pos: {
      x: this.pos.x,
      y: this.pos.y
    }
  }
  return packet
}

module.exports = PlayerClient
