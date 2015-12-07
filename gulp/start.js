var path = require('path');
var gulp = require('gulp');

// tasks
var uglify = require('./uglify');
var nunjucks = require('./nunjucks');
var sass = require('./sass');

function getRelativePath(dir) {
    return path.relative(process.cwd(), dir);
}

module.exports = function (config) {
    return function() {
        gulp.watch(config.views[0])
            .on('change', function(file) {
                console.log('File changed =>' + getRelativePath(file.path));
                nunjucks(config, file.path)();
            });

        gulp.watch(config.views[1])
            .on('change', function(file) {
                console.log('File changed =>' + getRelativePath(file.path));
                nunjucks(config)();
            });

        gulp.watch(config.scripts)
            .on('change', function(file) {
                console.log('File changed =>' + getRelativePath(file.path));
                uglify(config, file.path)();
            });

        gulp.watch(config.styles)
            .on('change', function(file) {
                console.log('File changed =>' + getRelativePath(file.path));
                sass(config, file.path)();
            });
    }
};
