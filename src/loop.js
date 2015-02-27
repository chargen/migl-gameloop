"use strict";

var raf = require('raf'),
    requestAnimationFrame = raf,
    cancelAnimationFrame = raf.cancel,
    inBrowser = typeof document === 'object' && typeof window === 'object';

var Loop = function () {
    this.running = false;
    this.runningMethod = this.run.bind(this);

    if (inBrowser) {
        this.observePageVisibility();
    }
};

Loop.prototype.lastTime = null;
Loop.prototype.frameRate = null;
Loop.prototype.running = null;
Loop.prototype.runningMethod = null;

/**
 * Start the game loop
 */
Loop.prototype.start = function () {
    if (this.running === false) {
        this.running = requestAnimationFrame(this.runningMethod);
    }
};

/**
 * Stop the game loop
 */
Loop.prototype.stop = function () {
    if (this.running !== false) {
        cancelAnimationFrame(this.running);
        this.running = false;
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
        if (!!document.hidden) {
            self.stop();
        } else {
            self.start();
        }
    };

    document.addEventListener('visibilitychange', visibilityChangeHandler);
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
    var deltaTime;

    if (this.lastTime === null) {
        deltaTime = 0;
    } else {
        deltaTime = time - this.lastTime;
    }

    if (this.validateFrame(deltaTime)) {
        this.lastTime = time;

        this.update(deltaTime);
        this.postUpdate(deltaTime);
        this.preRender(deltaTime);
        this.render(deltaTime);
        this.postRender(deltaTime);
    }

    this.running = requestAnimationFrame(this.runningMethod);
};

/**
 * Method first called on each frame
 * @param {float} deltaTime
 */
Loop.prototype.update = function (deltaTime) {
};

/**
 * Method called after the update and before the preRender on each frame
 * @param {float} deltaTime
 */
Loop.prototype.postUpdate = function (deltaTime) {
};

/**
 * Method called after the postUpdate and before the render on each frame
 * @param {float} deltaTime
 */
Loop.prototype.preRender = function (deltaTime) {
};

/**
 * Method called to render / draw the game after the preRender on each frame
 * @param {float} deltaTime
 */
Loop.prototype.render = function (deltaTime) {
};

/**
 * Method called after the render on each frame
 * @param deltaTime
 */
Loop.prototype.postRender = function (deltaTime) {
};

module.exports = Loop;
