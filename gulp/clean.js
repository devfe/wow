var gulp = require('gulp');
var clean = require('rimraf');
var async = require('async');

module.exports = function (config) {
    return function(cb) {
        async.map(config.clean, clean, function(err, results){
            if (err) {
                return console.log(err);
            }
            cb();
        });
    }
};

