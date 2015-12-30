var gulp       = require('gulp');
var data       = require('gulp-data');
var gulpif     = require('gulp-if');
var plumber    = require('gulp-plumber');
var livereload = require('gulp-livereload');

var Util       = require('./utils');
var Helper     = require('./helper');

var nunjucks = require('gulp.nunjucks');

/*
function getTplVal(data) {
    var res = '';
    for( var key in data ) {
        if ( data.hasOwnProperty(key) ) {
            res += '{% set '+ key +'="'+ data[key] +'" %}\n';
        }
    }
    return res;
}

function parseComponentTag (config) {
    var RE_COMPONENT = /\{\%\scomponent\s([^%]+)\%\}/g;
    var RE_NAME = /\bname=["'](\w+)["']/;
    var RE_DATA = /\bdata=["'](.+)["']/;

    var _component = {};

    return replace(RE_COMPONENT, function(source) {
        var mName = source.match(RE_NAME);
        var mData = source.match(RE_DATA);

        var name, data, result = source;

        if ( mName ) {
            name = mName[1];
        } else {
            console.error('Component name not given.');
            return result;
        }
        if ( mData ) {
            data = mData[1];
        }

        try {
            //console.log('Name: %s | Data: %s', name, data);
            data = (new Function('return ' + data))();
        } catch (e) {
            console.error('Component tag parse error. \n');
            console.log(e);
            return result;
        }

        var cPath = path.join(config.component, name, name);
        var cData = data ? getTplVal(data) : '';

        // 标记加载过的组件
        if ( !_component[cPath] ) {
            _component[cPath] = {
                name: name,
                path: cPath
            };
        }

        // include 组件模板后绑定参数data字段到当前组件作用域
        result = '\
        {% for i in range(0, 1) %}\n\
            '+ cData +'\
            {% include "'+ Util.dirToPath(cPath) +'.html" %}\n\
        {% endfor %}\n';

        return result;
    }).on('data', function(file) {
        config._components[file.path] = _component;
    });
}
*/

/**
 * 解析组件引用拼成对象数据
 *   _components: {
 *      "path/to/template/file": {
 *          "path/to/component0": { name: 'c2', path: ""},
 *          "path/to/component1": { name: 'c1', path: ""}
 *      }
 *   }
 */ 
function parseReference(config, file) {
    var content = String(file.contents);
    var RE_COMPONENT = /\{\%\scomponent\s([^%]+)\%\}/g;

    var results = content.match(RE_COMPONENT) || [];

    function getName(str) {
        return str.replace(/\{\%\scomponent\s/g, '')
            .replace(/\%\}/g, '')
            .replace(/\s/g, '')
            .replace(/'/g, '')
            .replace(/"/g, '').trim();
    }

    config._components[file.path] = {};

    results.forEach(function (r) {
        var name = getName(r.split(',')[0]);
        var cPath = config.component.refPath
            .replace(/{name}/g, name)
            .replace(/\.html/g, '');

        if (!config._components[file.path][cPath]) {
            config._components[file.path][cPath] = {
                name: name,
                path: cPath
            };
        }
    });
}

module.exports = function(config, file) {
    var src = file || config.views[0];
    var env = nunjucks.configure(config.source, {
        autoescape: false,
        trimBlocks: true,
        lstripBlocks: true
    });

    Helper.addExtensions(env, config);
    Helper.addFilters(env, config);
    Helper.addGlobals(env, config);

    return function(cb) {
        cb = cb || function() {};

        gulp.src(src, { base: config.source })
            //.pipe(parseComponentTag(config))
            .pipe(data(function (file) {
                return parseReference(config, file);
            }))
            .pipe(data(function (file) {
                return {
                    name: config.name,
                    version: config.version,
                    _components: config._components[file.path]
                };
            }))
            .pipe(plumber())
            .pipe(nunjucks())
            .pipe(gulp.dest(config.dest))
            .on('end', cb)
            .pipe(gulpif(config._isWatch, livereload()));
    }
};

