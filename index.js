"use strict";

var requestFrame = (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame
    ),
    cancelFrame = (
        window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelAnimationFrame
    ),
    visibilityApiSupport = typeof document.hidden === 'boolean',
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
    if (!requestFrame || !cancelFrame) {
        throw new Error('requestAnimationFrame and cancelAnimationFrame are not fully supported in this environment');
    }

    this.steps = prepareSteps(steps);

    this.frameRate = null;
    this.frameDuration = null;
    this.lastTime = null;
    this.running = false;
    this.runningMethod = this.run.bind(this);
    this.paused = false;

    if (visibilityApiSupport) {
        this.observePageVisibility();
    }
};

Loop.prototype.steps = null;
Loop.prototype.lastTime = null;
Loop.prototype.frameRate = null;
Loop.prototype.frameDuration = null;
Loop.prototype.running = null;
Loop.prototype.runningMethod = null;
Loop.prototype.paused = null;

/**
 * Set the frame rate of the loop
 * @param {number} frameRate Frame rate
 */
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
        this.running = requestFrame(this.runningMethod);
    }

    this.paused = false;
};

/**
 * Stop the game loop
 */
Loop.prototype.stop = function () {
    if (this.running !== false) {
        cancelFrame(this.running);
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
                self.paused = true;
                self.lastTime = null;
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

    this.running = requestFrame(this.runningMethod);

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

module.exports = Loop;
