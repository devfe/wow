var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

module.exports = function(config) {
    return function() {
        return sass(config.styles)
            .on('error', sass.logError)
            .pipe(gulp.dest(config.dest));
    }
};
