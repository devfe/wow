var path = require('path');

var gulp       = require('gulp');
var chokidar   = require('chokidar');
var livereload = require('gulp-livereload');

// tasks
var uglify    = require('./uglify');
var nunjucks  = require('./nunjucks');
var component = require('./component');
var sass      = require('./sass');

var Util = require('./utils');

function watchRunTask(src, cb) {
    chokidar.watch(src, {ignored: /[\/\\]\./})
        .on('all', function(event, path) {
            console.log(event);
            if (event === 'add' || event === 'change') {
                console.log('File ' + event + ' =>' + Util.dirToPath(Util.relativeDir(path)));
                cb(path);
            }
        });
}

module.exports = function (config) {
    return function(cb) {
        cb = cb || function() {};

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
        cb();
    }
};
