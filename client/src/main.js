var PlayerClient = require('./PlayerClient.js')

var serverURL = '10.182.47.139:9000'
var socket = require('socket.io-client')(serverURL)

// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.autoDetectRenderer(800, 600);

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

var bunny = new PlayerClient()
var username = prompt("What's your username?")
bunny.setUsername(username)
// Add the bunny's sprite to the scene we are building.
stage.addChild(bunny.sprite);
global.bunny = bunny

var otherBunnies = {}
global.otherBunnies = otherBunnies
var pickupTexture = PIXI.Texture.fromImage('carrot.png')
var pickups = {}

// kick off the animation loop (defined below)
animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    // move bunny using keyboard keys
    var hasMoved = bunny.moveUsingInput()
    if (hasMoved) {
      socket.emit('update_position', bunny.pos)
    }

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

socket.on('logged_player', function (bunnyInfo) {
  var otherBunny = new PlayerClient()
  otherBunny.setUsername(bunnyInfo.username)
  otherBunny.setColor(bunnyInfo.color)
  otherBunny.updatePosition(bunnyInfo.pos)
  stage.addChild(otherBunny.sprite)
  otherBunnies[bunnyInfo.id] = otherBunny
})

socket.on('update_position', function (pos) {
  // pos
  // {x, y, id}
  var otherBunny = otherBunnies[pos.id]
  if (otherBunny) {
    otherBunny.updatePosition(pos)
  }
})

socket.on('init_pickups', function (newPickups) {
  for (var pickupId in newPickups) {
    var pickup = newPickups[pickupId]
    var pickupSprite = new PIXI.Sprite(pickupTexture)
    pickupSprite.position.x = pickup.x
    pickupSprite.position.y = pickup.y
    pickupSprite.anchor.set(0.5, 0.5)
    pickupSprite.scale.set(0.1, 0.1)
    stage.addChild(pickupSprite)
    pickups[pickupId] = pickupSprite
  }
})

socket.on('collected_pickup', function (pickupId) {
  var pickupSprite = pickups[pickupId]
  if (pickupSprite) {
    stage.removeChild(pickupSprite)
    delete pickups[pickupId]
  }
})

socket.on('player_disconnected', function (id) {
  var otherBunny = otherBunnies[id]
  if (otherBunny) {
    stage.removeChild(otherBunny.sprite)
    delete otherBunnies[id] //otherBunnies[id] = undefined
  }
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('login', bunny.generatePacket())
})
// npm install
//
// npm run <script-name>
// npm run build
//
// node index.js
// http-server . <-p port>
