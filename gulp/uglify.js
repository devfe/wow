var gulp = require('gulp');

var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');

module.exports = function(config) {
    return function () {
        gulp.src(config.scripts)
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(gulpif(!config.isWatch, uglify()))
            .pipe(gulp.dest(config.dest));
    }
};
