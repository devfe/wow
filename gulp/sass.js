var gulp = require('gulp');
var sass = require('gulp-ruby-sass');

module.exports = function(config, file) {
    var src = file || config.styles;

    return function() {
        return sass(src, { base: config.source })
            .on('error', sass.logError)
            .pipe(gulp.dest(config.dest));
    }
};
