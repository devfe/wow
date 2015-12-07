var gulp = require('gulp');

// tasks
var uglify   = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass     = require('./gulp/sass');
var server   = require('./gulp/server');
var clean    = require('./gulp/clean');
var start    = require('./gulp/start');

// args
var argv    = require('minimist')(process.argv.slice(2));
var isWatch = argv._[0] === 'start';

// config
var config = {
    source: 'app',
    dest: isWatch ? 'www' : 'build',
    clean: ['www', 'build'],
    component: 'components',
    server: {
        dir: 'www',
        port: 1024,
        // 默认显示 index.html
        index: false
    },
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/**/*.scss'],
    scripts: ['app/**/*.js'],

    components: {},

    isWatch: isWatch
};

// registe tasks
gulp.task('uglify', uglify(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('sass', sass(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));
gulp.task('start', ['nunjucks', 'uglify', 'sass', 'server'], start(config));
