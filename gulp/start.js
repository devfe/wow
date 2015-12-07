var path = require('path');
var gulp = require('gulp');

var livereload = require('gulp-livereload');

// tasks
var uglify = require('./uglify');
var nunjucks = require('./nunjucks');
var sass = require('./sass');

function getRelativePath(dir) {
    return path.relative(process.cwd(), dir);
}

function watchRunTask(src, cb) {
    gulp.watch(src)
        .on('change', function(file) {
            console.log('File changed =>' + getRelativePath(file.path));
            cb(file);
        });
}

module.exports = function (config) {
    return function() {
        livereload.listen({ basePath: config.server.dir });
        watchRunTask(config.views[0], function (file) {
            nunjucks(config, file.path)();
        });

        watchRunTask(config.views[1], function (file) {
            nunjucks(config)();
        });

        watchRunTask(config.scripts, function (file) {
            uglify(config, file.path)();
        });
        watchRunTask(config.styles, function (file) {
            sass(config, file.path)();
        });
    }
};
