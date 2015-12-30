var gulp       = require('gulp');
var sass       = require('gulp-sass');
var minifyCss  = require('gulp-minify-css');
var modify     = require('gulp-modify');
var data       = require('gulp-data');
var header     = require('gulp.header');
var gulpif     = require('gulp-if');
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');

var Util   = require('./utils');
var Helper = require('./helper');


// npm install -g node-gyp
// node-gyp install --dist-url https://npm.taobao.org/mirrors/node
module.exports = function(config, file) {
    var src = file || config.styles;

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source})
            .pipe(data(function (file) {
                return Helper.getFileInfo(file.path);
            }))
            .pipe(plumber())
            .pipe(sass())
            .pipe(gulpif(config.replaceCSSUrl, modify({
                fileModifier: function(file) {
                    return Helper.replaceUrl(file, config.source,
                        config.domain + config.production);
                }
            })))
            .pipe(gulpif(!config._isDebug, minifyCss()))
            .pipe(gulpif(config._isRelease, header(config.banner, {
                date: Util.getTimeStr()
            })))
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
