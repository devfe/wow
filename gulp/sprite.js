var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

module.exports = function (config) {
    var sprite = config.sprite;

    return function (cb) {
        cb = cb || function() {};

        gulp.src(sprite.src)
            .pipe(spritesmith({
                imgName: sprite.imgName,
                cssName: sprite.cssName
            }))
            .pipe(gulp.dest(sprite.dest))
            .on('end', cb);
    }
};
