var gulp       = require('gulp');
var sass       = require('gulp-sass');
var minifyCss  = require('gulp-minify-css');
var modify     = require('gulp-modify');
var wrapper    = require('gulp-wrapper');
var gulpif     = require('gulp-if');
var livereload = require('gulp-livereload');

var Util   = require('./utils');
var Helper = require('./helper');

// node-gyp install --dist-url https://npm.taobao.org/mirrors/node
module.exports = function(config, file) {
    var src = file || config.styles;

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, {
                base: config.source
            }).
            pipe(sass())
        //sass(src, {
        //        base: config.source,
        //        style: 'compact'
        //    })
        //    .on('error', sass.logError)
            .pipe(gulpif(config.replaceCSSUrl, modify({
                fileModifier: function(file) {
                    return Helper.replaceUrl(file, config.source,
                        config.domain + config.production);
                }
            })))
            .pipe(gulpif(!config._isRelease, wrapper({
                header: function(file) {
                    return Util.getBanner(file, config);
                }
            })))
            .pipe(gulpif(!config._isDebug, minifyCss()))
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
