var gulp = require('gulp');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');

module.exports = function (config, file) {
    var sources = config._isWatch
        ? config.tests.concat(config.images)
        : config.images;

    var src = file || sources;

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
