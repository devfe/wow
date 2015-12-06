var gulp = require('gulp');
var clean = require('rimraf');

module.exports = function (config) {
    return function() {
        clean(config.dest, function(err) {
            if (err) {
                console.log('Clean working directory fail.');
            } else {
                console.log('Clean working directory success.');
            }
        });
    }
};
