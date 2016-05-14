"use strict";

var raf = (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame
);

var caf = (
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelAnimationFrame
);

module.exports = {
    requestAnimationFrame: raf,
    cancelAnimationFrame: caf,
    fullSupport: !!raf && !!caf
};
