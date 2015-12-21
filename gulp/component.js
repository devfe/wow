var path = require('path');
var gulp = require('gulp');

var data       = require('gulp-data');
var gulpif     = require('gulp-if');
var livereload = require('gulp-livereload');
var nunjucks   = require('gulp.nunjucks');
var modify     = require('gulp-modify');

var Util       = require('./utils');
var Helper     = require('./helper');
var _          = require('lodash');

function addData(file, config) {
    var dirname = path.dirname(file.path);
    var cfgPath = path.join(dirname, config.component.config);
    var config = {};

    if (Util.hasContents(cfgPath)) {
        config = require(cfgPath);
    }
    var result = _.assign({
        _layout: config._layout,
        _blocks: config._blocks,
        _config: cfgPath
    }, config.data);

    // clear node module cache
    delete require.cache[cfgPath];
    return result;
}
function addLayout(file, content) {
    var data = file.data;

    if (data._layout) {
        var blockStr = '';
        for ( var key in data._blocks ) {
            if ( data._blocks.hasOwnProperty(key) ) {
                blockStr += data._blocks[key] + '\n';
            }
        }
        var result = '{% extends "'+ data._layout +'" %}\
                '+ blockStr +'\
                {% block body %}\
                '+ content +'\
                {% endblock %}';
        return result;
    } else {
        return content;
    }
}

module.exports = function (config, file) {
    var src = file || config.components;
    var env = nunjucks.configure(config.source, {
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true
    });

    Helper.addExtensions(env, config);
    Helper.addFilters(env, config);
    Helper.addGlobals(env, config);

    return function (cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            .pipe(data(function (file) {
                return addData(file, config);
            }))
            .pipe(modify({
                fileModifier: addLayout
            }))
            .pipe(nunjucks())
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};
