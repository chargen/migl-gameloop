# migl-gameloop

Micro Game Library : Game Loop

## Features

 * The game loop can be started and stopped at any time
 * The frame rate can be arbitrarily capped at any time with FlexibleLoop
 * One implementation with variable time steps and two implementations with fixed time steps
 * The game loop does not make any assumption about your renderer
 * Several loops can run at the same time on a given web page
 * The game loop is automatically paused when the page is hidden and resumes when it is once again visible
 * Support for WebVR (using the provided VRDisplay.*AnimationFrame() methods)

## Basic example

```js
var Gameloop = require('migl-gameloop').flexible,
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

## Implementations

There are three implementations of the game loop :

### FlexibleLoop

A game loop with a variable time step. Best used when having consistent behaviors is not critical. It's the game loop
to use if "jank-free" sounds better than "deterministic" to you.

If the actual framerate of the user drops, the game won't slow down.

Accessible through `require('migl-gameloop').flexible`.

### FixedFullFramerateLoop

A game loop with a fixed time step. Best used when having consistent behaviors is critical, for example if you need
to be able to save and read replays or if you need deterministic behaviors for time-bound systems (physics, AI, ...).

If the actual framerate of the user drops, the game will actually slow down.

Accessible through `require('migl-gameloop').fixedFullFramerate`.

### FixedHalfFramerateLoop

A game loop with a fixed time step where the update methods are executed on one animation frame and
the render methods are executed on the next one. Best used when having consistent behaviors is critical and when the
game is just too demanding to run at 60fps on the user computer. It's best to let the user choose whether he wants this
30fps cap or not.

If the actual framerate of the user drops, the game will actually slow down.

Accessible through `require('migl-gameloop').fixedHalfFramerate`.

## Framerate limiting with the FlexibleLoop

The target number of frames per second can be defined at anytime with the FlexibleLoop implementation.

```
loop.setFrameRate(30);
```

It should be noted that, due to the way the browser works, only values equal to the base framerate of the browser
(usually 60 fps, but 90 fps for WebVR browsers) divided by an integer makes sense.

## Starting and stopping the loop

The library exposes a start and a stop method.

## VR support

When working with WebVR it is important not to use the requestAnimationFrame and cancelAnimationFrame of the window
object but instead use the implementation on the [VRDisplay](https://developer.mozilla.org/fr/docs/Web/API/VRDisplay)
object in order to hit 90 fps.

You can specify a VRDisplay object to use as the second argument of the constructor.

```js
var loop = new Gameloop({
    update: function(deltaTime) {
        //do something ... the actual game logic

        frame++;
    },
    render: function(deltaTime) {
        //do something ... display things on screen

        console.log('frame #' + frame);
    }
}, someVRDisplay);
```

Additionally you can change the display of the gameloop at anytime with the setDisplay() method.

```js
navigator.getVRDisplays().then(function(displays) {
    if (displays.length > 0) {
        loop.setDisplay(displays[0]);
        // loop.setFramerate(90); //needed with FixedFullFramerateLoop to make sure the deltatime returned matches 90fps
    }
});
```

The method can also be used to switch back to window instead of a VRDisplay.

```js
loop.setDisplay(window);
```

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

### [3.0.0](https://github.com/kchapelier/migl-gameloop/tree/3.0.0) (2017-05-15)

 * Proper support for WebVR through the new setDisplay() method.
 * The constructors now also accept a display argument.
 * New implementation 'FixedFullFramerateLoop'.
 * New implementation 'FixedHalfFramerateLoop'.
 * FlexibleLoop now uses performance.now() when available for more precise deltaTime.
 * Changed the module interface.
 * Remove gulp and jshint-stylish from dev dependency, uses npm scripts instead.

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
