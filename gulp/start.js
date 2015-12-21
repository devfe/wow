var path = require('path');

var gulp       = require('gulp');
var livereload = require('gulp-livereload');

// tasks
var uglify    = require('./uglify');
var nunjucks  = require('./nunjucks');
var component = require('./component');
var sass      = require('./sass');

var Util = require('./utils');

function watchRunTask(src, cb) {
    gulp.watch(src)
        .on('change', function(file) {
            console.log('File changed =>' + Util.relativeDir(file.path));
            cb(file);
        });
}

module.exports = function (config) {
    return function() {
        livereload.listen({ basePath: config.server.dir });

        if (config._argv.c) {
            component(config)();
            watchRunTask(config.components, function (file) {
                var dirname = path.dirname(file.path);
                var basename = path.basename(dirname);
                var template = path.join(dirname, basename + '.html');

                component(config, template)();
            });
        }

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
