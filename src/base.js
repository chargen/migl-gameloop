"use strict";

var visibilityApiSupport = typeof document.hidden === 'boolean',
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

/**
 *
 * @param {object} steps
 * @param {VRDisplay|Window} display
 * @constructor
 */
var BaseLoop = function (steps, display) {
    this.setDisplay(display);

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

/**
 * Set the display, either a VRDisplay instance or the window object
 * @param {VRDisplay|Window} display
 */
BaseLoop.prototype.setDisplay = function (display) {
    display = display || window;

    var previousCancelFrame = this.cancelFrame;

    this.requestFrame = (
        display.requestAnimationFrame ||
        display.webkitRequestAnimationFrame ||
        display.mozRequestAnimationFrame
    );

    this.cancelFrame = (
        display.cancelAnimationFrame ||
        display.webkitCancelAnimationFrame ||
        display.webkitCancelRequestAnimationFrame ||
        display.mozCancelAnimationFrame
    );

    if (!this.requestFrame || !this.cancelFrame) {
        throw new Error('requestAnimationFrame and cancelAnimationFrame are not supported by the display object');
    }

    this.requestFrame = this.requestFrame.bind(display);
    this.cancelFrame = this.cancelFrame.bind(display);

    if (this.running !== false) {
        previousCancelFrame(this.running);
        this.running = this.requestFrame(this.runningMethod);
    }
};

BaseLoop.prototype.steps = null;
BaseLoop.prototype.lastTime = null;
BaseLoop.prototype.running = null;
BaseLoop.prototype.runningMethod = null;
BaseLoop.prototype.paused = null;

/**
 * Start the game loop
 */
BaseLoop.prototype.start = function () {
    if (this.running === false) {
        this.running = this.requestFrame(this.runningMethod);
    }

    this.paused = false;
};

/**
 * Stop the game loop
 */
BaseLoop.prototype.stop = function () {
    if (this.running !== false) {
        this.cancelFrame(this.running);
        this.running = false;
        this.paused = false;
        this.lastTime = null;
    }
};

/**
 * Add an event listener to the document's visibilitychange to stop the loop when the page is hidden
 * @protected
 */
BaseLoop.prototype.observePageVisibility = function () {
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
BaseLoop.prototype.run = function (time) {
    console.log('BaseLoop.prototype.run', time);
};

module.exports = BaseLoop;
