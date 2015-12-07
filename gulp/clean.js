var gulp = require('gulp');
var clean = require('rimraf');

module.exports = function (config) {
    return function() {
        config.clean.forEach(function (dir) {
            clean(dir, function(err) {
                if (err) {
                    console.log('Clean working directory fail.');
                } else {
                    console.log('Clean working directory success.');
                }
            });
        });
    }
};
