var gulp = require('gulp');
var spritesmith = require('gulp.spritesmith');

module.exports = function (config) {
    var sprite = config.sprite;

    return function () {
        var spriteData = gulp.src(sprite.src)
            .pipe(spritesmith({
                imgName: sprite.imgName,
                cssName: sprite.cssName
            }));
        return spriteData
            .pipe(gulp.dest(sprite.dest));
    }
};
