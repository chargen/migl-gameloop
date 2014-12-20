# migl-gameloop

Micro Game Library : Game Loop

## Features

 * The game loop can be started and stopped at any time
 * The frame rate can be arbitrarily capped at any time
 * The game loop does not make any assumption about your renderer
 * Several loops can run at the same time on a given web page
 * The library can also run on the server (relying on raf's ability to do so)

## Basic example

```js
var Gameloop = require('migl-gameloop');

var loop = new Gameloop(),
    frame = 0;

loop.update = function(deltaTime) {
    //do something ... the actual game logic

    frame++;
};

loop.render = function(deltaTime) {
    //do something ... display things on screen

    console.log('frame #' + frame);
};

loop.start();
```

## Starting and stopping the loop

The library exposes a start and stop methods

## Framerate limiting

The target number of frames per second can be defined at anytime.

```loop.frameRate = 30;```

## Hooks :

The library exposes five method hooks, here listed in order of execution :

 * preUpdate
 * update
 * postUpdate
 * render
 * postRender
