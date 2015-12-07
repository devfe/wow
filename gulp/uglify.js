var gulp = require('gulp');

var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');

module.exports = function(config, file) {
    var src = file || config.scripts;
    return function () {
        gulp.src(src, { base: config.source })
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(gulpif(!config.isWatch, uglify()))
            .pipe(gulp.dest(config.dest))
            .pipe(gulpif(config.isWatch, livereload()));
    }
};
