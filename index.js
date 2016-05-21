"use strict";

var requestAnimationFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame
    ),
    cancelAnimationFrame = (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame
    ),
    noop = function noop () {},
    expectedSteps = ['update', 'postUpdate', 'preRender', 'render', 'postRender', 'pause', 'resume'];

/**
 *
 * @param {object} steps
 * @returns {object} Steps object with noop for any missing step
 */
function prepareSteps (steps) {
    var mergedSteps = {},
        i = 0,
        key;

    for (; i < expectedSteps.length; i++) {
        key = expectedSteps[i];

        if (steps && typeof steps[key] === 'function') {
            mergedSteps[key] = steps[key];
        } else {
            mergedSteps[key] = noop;
        }
    }

    return mergedSteps;
}

var Loop = function (steps) {
    if (!requestAnimationFrame || !cancelAnimationFrame) {
        throw new Error('requestAnimationFrame and cancelAnimationFrame are not fully supported in this environment');
    }

    this.steps = prepareSteps(steps);

    this.frameRate = null;
    this.frameDuration = null;
    this.lastTime = null;
    this.running = false;
    this.runningMethod = this.run.bind(this);
    this.paused = false;

    this.observePageVisibility();
};

Loop.prototype.steps = null;
Loop.prototype.lastTime = null;
Loop.prototype.frameRate = null;
Loop.prototype.frameDuration = null;
Loop.prototype.running = null;
Loop.prototype.runningMethod = null;
Loop.prototype.paused = null;

Loop.prototype.setFrameRate = function (frameRate) {
    if (frameRate) {
        this.frameRate = frameRate;
        this.frameDuration = 1000 / this.frameRate;
    } else {
        this.frameRate = null;
        this.frameDuration = null;
    }
};

/**
 * Start the game loop
 */
Loop.prototype.start = function () {
    if (this.running === false) {
        this.running = requestAnimationFrame(this.runningMethod);
    }

    this.paused = false;
};

/**
 * Pause the game loop
 * @protected
 */
Loop.prototype.pause = function () {
    this.paused = true;
    this.lastTime = null;
};

/**
 * Stop the game loop
 */
Loop.prototype.stop = function () {
    if (this.running !== false) {
        cancelAnimationFrame(this.running);
        this.running = false;
        this.paused = false;
        this.lastTime = null;
    }
};

/**
 * Add an event listener to the document's visibilitychange to stop the loop when the page is hidden
 * @protected
 */
Loop.prototype.observePageVisibility = function () {
    var self = this;

    var visibilityChangeHandler = function visibilityChangeHandler () {
        if (self.running !== false) {
            if (!self.paused && !!document.hidden) {
                self.pause();
                self.steps.pause();
            } else if (self.paused) {
                self.start();
                self.steps.resume();
            }
        }
    };

    window.document.addEventListener('visibilitychange', visibilityChangeHandler);
};

/**
 * Main method called at each interval
 * @protected
 * @param time
 */
Loop.prototype.run = function (time) {
    var steps = this.steps,
        deltaTime = this.lastTime === null ? 0 : time - this.lastTime;

    this.running = requestAnimationFrame(this.runningMethod);

    if (deltaTime >= this.frameDuration || this.frameRate === null || this.lastTime === null) {
        if (!this.paused) {
            steps.update(deltaTime);
            steps.postUpdate(deltaTime);
            steps.preRender(deltaTime);
            steps.render(deltaTime);
            steps.postRender(deltaTime);
        }

        //this.lastTime = time - (this.frameDuration ? deltaTime % this.frameDuration : 0);
        this.lastTime = time;
    }
};

module.exports = Loop;
