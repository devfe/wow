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
            //console.log('[%s] %s', event, path);
            cb(path);
        });
}

module.exports = function (config) {
    return function(cb) {
        cb = cb || function() {};

        livereload.listen({ basePath: config.server.dir });

        if (config._argv.c) {
            component(config)();
            watchRunTask(config.components, function (filename) {
                var dirname = path.dirname(filename);
                var basename = path.basename(dirname);
                var template = path.join(dirname, basename + '.html');

                component(config, template)();
            });
        }

        nunjucks(config)();
        watchRunTask(config.views[0], function (filename) {
            nunjucks(config, filename)();
        });

        watchRunTask(config.views[1], function () {
            nunjucks(config)();
        });
        watchRunTask(config.scripts, function (filename) {
            uglify(config, filename)();
        });

        watchRunTask(config.styles, function (filename) {
            sass(config, filename)();
        });

        cb();
    }
};
