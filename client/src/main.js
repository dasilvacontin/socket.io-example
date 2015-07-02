var KeyboardJS = require('./Keyboard.js')
var keyboard = new KeyboardJS(false)

var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

// You can use either `new PIXI.WebGLRenderer`, `new PIXI.CanvasRenderer`, or `PIXI.autoDetectRenderer`
// which will try to choose the best renderer for the environment you are in.
var renderer = new PIXI.WebGLRenderer(800, 600);

// The renderer will create a canvas element for you that you can then insert into the DOM.
document.body.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// This creates a texture from a 'bunny.png' image.
var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
var bunny = new PIXI.Sprite(bunnyTexture);
global.bunny = bunny
var carrotTexture = PIXI.Texture.fromImage('carrot.png');
var otherBunnies = {}
var carrots = {}
var bunnySpeed = 5

// Setup the position and scale of the bunny
bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)

// Add the bunny to the scene we are building.
stage.addChild(bunny);

// kick off the animation loop (defined below)
animate();

function animate() {
    // start the timer for the next animation loop
    requestAnimationFrame(animate);

    /*
    var oldPos = {
      x: bunny.position.x,
      y: bunny.position.y
    }
    */
    var oldPos = bunny.position.clone()

    // move bunny using keyboard keys
    if (keyboard.char('W')) bunny.position.y -= bunnySpeed
    if (keyboard.char('A')) bunny.position.x -= bunnySpeed
    if (keyboard.char('D')) bunny.position.x += bunnySpeed
    if (keyboard.char('S')) bunny.position.y += bunnySpeed

    if (oldPos.x != bunny.position.x || oldPos.y != bunny.position.y) {
      socket.emit('update_position', bunny.position)
    }

    // this is the main render call that makes pixi draw your container and its children.
    renderer.render(stage);
}

socket.on('update_position', function (pos) {
  // pos
  // {x, y, id}
  var sprite = otherBunnies[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
})

socket.on('update_carrot_pos', function (pos) {
  // pos
  // {x, y, id}
  var sprite = carrots[pos.id]
  if (!sprite) {
    sprite = new PIXI.Sprite(carrotTexture)
    stage.addChild(sprite)
    carrots[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    //sprite.scale.x = 0.1
    //sprite.scale.y = 0.1
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
})

socket.on('player_disconnected', function (id) {
  var sprite = otherBunnies[id]
  if (sprite) {
    stage.removeChild(sprite)
  }
  delete otherBunnies[id] //otherBunnies[id] = undefined
})

socket.on('carrot_pick_up', function (carrotID, playerID) {
  console.log('player: deleting carrot '+carrotID+' from player '+playerID+'on socket '+socket.id)
  var sprite = carrots[carrotID]
  if (sprite) {
    stage.removeChild(sprite)
  }
  delete carrots[carrotID] //otherBunnies[id] = undefined
  if (socket.id == playerID)
    console.log(playerID+': wiiii :3')
  else
    console.log(playerID+': joops :(')
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('update_position', bunny.position)
})
// npm install
//
// npm run <script-name>
// npm run build
//
// node index.js
// http-server . <-p port>
