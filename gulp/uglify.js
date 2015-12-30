var gulp = require('gulp');

var uglify     = require('gulp-uglify');
var eslint     = require('gulp-eslint');
var data       = require('gulp-data');
var header     = require('gulp.header');
var gulpif     = require('gulp-if');
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');

var Util   = require('./utils');
var Helper = require('./helper');

module.exports = function(config, file) {
    var src = file || config.scripts;
    return function (cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            .pipe(data(function (file) {
                return Helper.getFileInfo(file.path);
            }))
            .pipe(gulpif(config._isRelease, eslint()))
            .pipe(gulpif(config._isRelease, eslint.format()))
            .pipe(gulpif(!config._isWatch, plumber()))
            .pipe(gulpif(!config._isWatch, uglify()))
            .pipe(gulpif(config._isRelease, header(config.banner, {
                date: Util.getTimeStr()
            })))
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
