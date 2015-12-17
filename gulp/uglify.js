var gulp = require('gulp');

var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var wrapper = require('gulp-wrapper');
var livereload = require('gulp-livereload');
var Util = require('./utils');

module.exports = function(config, file) {
    var src = file || config.scripts;
    return function (cb) {
        return gulp.src(src, { base: config.source })
            .pipe(eslint())
            .pipe(eslint.format())
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
