"use strict";

var BaseLoop = require('./base'),
    performanceNow = typeof window !== 'undefined' && !!window.performance && !!window.performance.now ? window.performance.now.bind(window.performance) : false;

/**
 *
 * @param {object} steps
 * @param {VRDisplay|Window} display
 * @constructor
 */
var FlexibleLoop = function (steps, display) {
    BaseLoop.call(this, steps, display);
};

FlexibleLoop.prototype = Object.create(BaseLoop.prototype);
FlexibleLoop.prototype.constructor = FlexibleLoop;

FlexibleLoop.prototype.frameRate = null;
FlexibleLoop.prototype.frameDuration = null;

/**
 * Set the frame rate of the loop
 * @param {number} frameRate Frame rate
 */
FlexibleLoop.prototype.setFrameRate = function (frameRate) {
    if (frameRate) {
        this.frameRate = frameRate;
        this.frameDuration = 1000 / this.frameRate;
    } else {
        this.frameRate = null;
        this.frameDuration = null;
    }
};

/**
 * Main method called at each interval
 * @protected
 * @param time
 */
FlexibleLoop.prototype.run = function (time) {
    time = performanceNow ? performanceNow() : time;

    var steps = this.steps,
        deltaTime = this.lastTime === null ? 0 : time - this.lastTime;

    this.running = this.requestFrame(this.runningMethod);

    if (deltaTime >= this.frameDuration || this.frameRate === null || this.lastTime === null) {
        if (!this.paused) {
            steps.update(deltaTime);
            steps.postUpdate(deltaTime);
            steps.preRender(deltaTime);
            steps.render(deltaTime);
            steps.postRender(deltaTime);
        }

        this.lastTime = time;
    }
};

module.exports = FlexibleLoop;
