var gulp = require('gulp');

var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var wrapper = require('gulp-wrapper');
var livereload = require('gulp-livereload');
var Util = require('./utils');

module.exports = function(config, file) {
    var src = file || config.tests.concat(config.scripts);
    return function (cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            .pipe(gulpif(!config._isWatch, eslint()))
            .pipe(gulpif(!config._isWatch, eslint.format()))
            .pipe(gulpif(!config._isWatch, uglify()))
            .pipe(gulpif(config._isRelease, wrapper({
                header: function(file) {
                    return Util.getBanner(file, config);
                }
            })))
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
