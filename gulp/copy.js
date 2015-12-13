var gulp = require('gulp');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');

module.exports = function (config, file) {
    var src = file || config.images;

    return function() {
        return gulp.src(src, { base: config.source })
            .pipe(gulp.dest(config.dest))
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
