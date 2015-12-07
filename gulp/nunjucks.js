var path = require('path');

var gulp = require('gulp');
var data = require('gulp-data');
var replace = require('gulp-replace');
var nunjucksRender = require('gulp-nunjucks-render');

function getTplVal(data) {
    var res = '';
    for( var key in data ) {
        if ( data.hasOwnProperty(key) ) {
            res += '{% set '+ key +'="'+ data[key] +'" %}\n';
        }
    }
    return res;
}

function dirToPath (dir) {
    dir = path.normalize(dir);
    return dir.replace(/\\/g, '/');
}

function parseComponentTag (config) {
    var RE_COMPONENT = /\{\%\scomponent\s([^%]+)\%\}/g;
    var RE_NAME = /\bname=["'](\w+)["']/;
    var RE_DATA = /\bdata=["'](.+)["']/;

    var _component = {
        map: {},
        list: []
    };

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

        // 标记加载过的组件
        if ( !_component.map[name] ) {
            _component.map[name] = 'loaded';
            _component.list.push(name);
        }

        var cPath = path.join(config.component, name, name);
        var cData = data ? getTplVal(data) : '';

        // include 组件模板后绑定参数data字段到当前组件作用域
        result = '\
        {% for i in range(0, 1) %}\n\
            '+ cData +'\
            {% include "'+ dirToPath(cPath) +'.html" %}\n\
        {% endfor %}\n';

        return result;
    }).on('data', function(file) {
        config.components[file.path] = _component;
    });
}

module.exports = function(config, file) {
    var src = file || config.views[0];
    nunjucksRender.nunjucks.configure(config.source, {watch: false});

    return function() {
        return gulp.src(src, { base: config.source })
            .pipe(parseComponentTag(config))
            .pipe(data(function (file) {
                return {
                    _component: config.components[file.path]
                };
            }))
            .pipe(nunjucksRender())
            .pipe(gulp.dest(config.dest));
    }
};

