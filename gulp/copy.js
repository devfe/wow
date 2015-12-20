var gulp = require('gulp');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');

module.exports = function (config, file) {
    var src = file || config.tests.concat(config.images);

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
