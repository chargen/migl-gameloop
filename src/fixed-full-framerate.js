"use strict";

var BaseLoop = require('./base');

/**
 *
 * @param {object} steps
 * @param {VRDisplay|Window} display
 * @param {number} expectedFrameRate
 * @constructor
 */
var FixedFullLoop = function (steps, display, expectedFrameRate) {
    BaseLoop.call(this, steps, display);

    this.setFrameRate(expectedFrameRate);
};

FixedFullLoop.prototype = Object.create(BaseLoop.prototype);
FixedFullLoop.prototype.constructor = FixedFullLoop;

FixedFullLoop.prototype.frameRate = null;
FixedFullLoop.prototype.frameDuration = null;

/**
 * Set the frame rate of the loop
 * @param {number} frameRate Frame rate
 */
FixedFullLoop.prototype.setFrameRate = function (frameRate) {
    this.frameRate = frameRate || 60;
    this.frameDuration = (10000000 / this.frameRate | 0) / 10000;
};

/**
 * Main method called at each interval
 * @protected
 */
FixedFullLoop.prototype.run = function () {
    var steps = this.steps,
        deltaTime = this.frameDuration;

    this.running = this.requestFrame(this.runningMethod);

    if (!this.paused) {
        steps.update(deltaTime);
        steps.postUpdate(deltaTime);
        steps.preRender(deltaTime);
        steps.render(deltaTime);
        steps.postRender(deltaTime);
    }
};

module.exports = FixedFullLoop;
