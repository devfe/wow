var gulp = require('gulp');

var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var wrapper = require('gulp-wrapper');
var livereload = require('gulp-livereload');
var Util = require('./utils');

module.exports = function(config, file) {
    var src = file || config.scripts;
    return function () {
        gulp.src(src, { base: config.source })
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(gulpif(!config.isWatch, uglify()))
            .pipe(gulpif(config.isRelease, wrapper({
                header: function(file) {
                    return Util.getBanner(file, config);
                }
            })))
            .pipe(gulp.dest(config.dest))
            .pipe(gulpif(config.isWatch, livereload()));
    }
};
