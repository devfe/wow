var gulp = require('gulp');
var data = require('gulp-data');
var spritesmith = require('gulp.spritesmith');
var rename = require("gulp-rename");
var gulpFilter = require('gulp-filter');
var imageminPngquant = require('imagemin-pngquant');
var buffer = require('vinyl-buffer');

var path = require('path');

module.exports = function (config) {
    var sprite = config.sprite;

    return function (cb) {
        cb = cb || function() {};

        var pngFilter = gulpFilter(['**/*.png']);

        gulp.src(sprite.src)
            .pipe(spritesmith({
                imgName: sprite.imgName,
                cssName: sprite.cssName,
                cssTemplate: 'app/components/main/template.css.handlebars'
            }))
            .pipe(gulp.dest(sprite.dest))
            .pipe(pngFilter)
            .pipe(buffer())
            .pipe(rename(function (path) {
                path.basename += '_8';
                path.extname = '.png'
            }))
            .pipe(imageminPngquant()())
            .pipe(gulp.dest(sprite.dest))
            .on('end', cb);
    }
};
