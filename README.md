# migl-gameloop

Micro Game Library : Game Loop

## Features

 * The game loop can be started and stopped at any time
 * The frame rate can be arbitrarily capped at any time
 * The game loop does not make any assumption about your renderer
 * Several loops can run at the same time on a given web page
 * The game loop is automatically paused when the page is hidden and resumes when it is once again visible

## Basic example

```js
var Gameloop = require('migl-gameloop'),
    frame = 0;

var loop = new Gameloop({
        update: function(deltaTime) {
            //do something ... the actual game logic

            frame++;
        },
        render: function(deltaTime) {
            //do something ... display things on screen

            console.log('frame #' + frame);
        }
    });

loop.start();
```

## Starting and stopping the loop

The library exposes a start and a stop method.

## Framerate limiting

The target number of frames per second can be defined at anytime.

```
loop.setFrameRate(30);
```

It should be noted that, due to the way the browser works, only values equal to the base frame rate of the browser (usually 60 fps, but 90 fps for WebVR browsers) divided by an integer makes sense.

## Hooks :

The library accepts five loop hooks, here listed in order of execution :

 * preUpdate
 * update
 * postUpdate
 * render
 * postRender

As well as two events hooks to detect when the loops is automatically paused or resumed due to the page visibility :

 * pause
 * resume

## Changelog

### [2.0.0](https://github.com/kchapelier/migl-gameloop/tree/2.0.0) (2016-05-21)

 * Change constructor API.
 * Add setFrameRate method instead of direct use of the frameRate property.
 * Add hooks for 'pause' and 'resume' events.
 * Stop depending on raf, stop trying to make up for lack of requestAnimationFrame / cancelAnimationFrame support.
 * Does not support node.js (server side) anymore.
 * Smaller.

### [1.2.1](https://github.com/kchapelier/migl-gameloop/tree/1.2.1) (2015-09-18) :

 * Fix stop() not working properly.
 * Update dependencies.

### 1.1.0 (2015-02-28) :

 * In the browser, pause the loop when the page is hidden and resume when it's once again visible.

### 1.0.0 (2014-12-20) :

 * First implementation.
