"use strict";

var raf = require('./raf'),
    requestAnimationFrame = raf.requestAnimationFrame,
    cancelAnimationFrame = raf.cancelAnimationFrame,
    noop = function () {},
    expectedSteps = ['update', 'postUpdate', 'preRender', 'render', 'postRender'];

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
    if (!raf.fullSupport) {
        throw new Error('requestAnimationFrame and cancelAnimationFrame are not fully supported by this browser');
    }

    this.steps = prepareSteps(steps);

    this.lastTime = null;
    this.frameRate = null;
    this.running = false;
    this.runningMethod = this.run.bind(this);
    this.paused = false;

    this.observePageVisibility();
};

Loop.prototype.steps = null;
Loop.prototype.lastTime = null;
Loop.prototype.frameRate = null;
Loop.prototype.running = null;
Loop.prototype.runningMethod = null;
Loop.prototype.paused = null;

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
            if (!!document.hidden) {
                self.pause();
            } else {
                self.start();
            }
        }
    };

    window.document.addEventListener('visibilitychange', visibilityChangeHandler);
};

/**
 * Validate the frame in regards to frame limiting
 * @protected
 * @param {float} deltaTime
 * @returns {boolean} Validity of the frame
 */
Loop.prototype.validateFrame = function (deltaTime) {
    if (this.frameRate === null || this.lastTime === null) {
        return true;
    }

    var frameDuration = 1000 / this.frameRate;

    return deltaTime >= frameDuration;
};

/**
 * Main method called at each interval
 * @protected
 * @param time
 */
Loop.prototype.run = function (time) {
    var steps = this.steps,
        deltaTime;

    if (this.lastTime === null) {
        deltaTime = 0;
    } else {
        deltaTime = time - this.lastTime;
    }

    this.running = requestAnimationFrame(this.runningMethod);

    if (this.validateFrame(deltaTime)) {
        this.lastTime = time;

        if (!this.paused) {
            steps.update(deltaTime);
            steps.postUpdate(deltaTime);
            steps.preRender(deltaTime);
            steps.render(deltaTime);
            steps.postRender(deltaTime);
        }
    }
};

module.exports = Loop;
