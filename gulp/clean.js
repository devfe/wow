var gulp = require('gulp');
var clean = require('gulp-clean');

module.exports = function (config) {
    return function() {
        return gulp.src(config.dest)
            .pipe(clean());
    }
};
