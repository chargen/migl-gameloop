"use strict";

var BaseLoop = require('./base');

/**
 *
 * @param {object} steps
 * @param {VRDisplay|Window} display
 * @param {number} expectedFrameRate
 * @constructor
 */
var FixedHalfLoop = function (steps, display, expectedFrameRate) {
    BaseLoop.call(this, steps, display);

    this.setFrameRate(expectedFrameRate);
};

FixedHalfLoop.prototype = Object.create(BaseLoop.prototype);
FixedHalfLoop.prototype.constructor = FixedHalfLoop;

FixedHalfLoop.prototype.frameRate = null;
FixedHalfLoop.prototype.frameDuration = null;
FixedHalfLoop.prototype.phase = 0;

/**
 * Set the frame rate of the loop
 * @param {number} frameRate Frame rate
 */
FixedHalfLoop.prototype.setFrameRate = function (frameRate) {
    this.frameRate = frameRate || 30;
    this.frameDuration = (10000000 / this.frameRate | 0) / 10000;
};

/**
 * Main method called at each interval
 * @protected
 */
FixedHalfLoop.prototype.run = function () {
    var steps = this.steps,
        deltaTime = this.frameDuration;

    this.running = this.requestFrame(this.runningMethod);

    if (this.phase === 0) {
        if (!this.paused) {
            steps.update(deltaTime);
            steps.postUpdate(deltaTime);
            this.phase = 1;
        }
    } else {
        steps.preRender(deltaTime);
        steps.render(deltaTime);
        steps.postRender(deltaTime);
        this.phase = 0;
    }
};

module.exports = FixedHalfLoop;
