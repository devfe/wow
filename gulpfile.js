var path = require('path');
var gulp = require('gulp');
var wow = require('./gulp/wow');

var argv = require('minimist')(process.argv.slice(2));

var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var gls = require('gulp-live-server');
var data = require('gulp-data');
var replace = require('gulp-replace');
var clean = require('gulp-clean');

var Util = require('./gulp/utils');

var config = {
    source: 'app',
    server: {
        dir: 'www',
        port: 1024,
        index: true
    },
    dest: argv.w ? 'www' : 'build',
    component: 'components',
    scripts: ['app/**/*.js'],
    styles: ['app/**/*.scss'],
    views: ['app/views/*.html']
};
var componentPackage = {};
nunjucksRender.nunjucks.configure(config.source, {watch: false});

gulp.task('uglify', function() {
    return gulp.src(config.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(config.dest));
});
gulp.task('sass', function() {
    return sass(config.styles)
        .on('error', sass.logError)
        .pipe(gulp.dest(config.dest));
});
function getTplVal(data) {
    var res = '';
    for( var key in data ) {
        if ( data.hasOwnProperty(key) ) {
            res += '{% set '+ key +'="'+ data[key] +'" %}\n';
        }
    }
    return res;
}
function parseComponentTag () {
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
            {% include "'+ Util.dirToPath(cPath) +'.html" %}\n\
        {% endfor %}\n';

        return result;
    }).on('data', function(file) {
        componentPackage[file.path] = _component;
    });
}
function getComponents (components) {
}
function getComponentData (file) {
    return {
        _component: componentPackage[file.path]
    };
}

gulp.task('nunjucks', function(bar) {
    return gulp.src(config.views, { base: config.source })
        .pipe(parseComponentTag())
        .pipe(data(getComponentData))
        .pipe(nunjucksRender())
        .pipe(gulp.dest(config.dest));
});

gulp.task('server', ['watch'], function() {
    wow.server(config.server.dir, config.server.port, {
        index: config.server.index
    });
});
gulp.task('watch', ['nunjucks', 'sass', 'uglify'], function() {
    gulp.watch(config.views, ['nunjucks']);
    gulp.watch(config.styles, ['sass']);
    gulp.watch(config.scripts, ['uglify']);
});
gulp.task('clean', function(cb) {
    return gulp.src(config.dest)
        .pipe(clean());
});
