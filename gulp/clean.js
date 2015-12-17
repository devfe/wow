var gulp = require('gulp');
var clean = require('rimraf');

module.exports = function (config) {
    var src = config.clean;

    return function() {
        src.forEach(function (dir) {
            clean.sync(dir);
        });
    }
};
