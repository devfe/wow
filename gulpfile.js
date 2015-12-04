var gulp = require('gulp');

// tasks
var uglify = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass = require('./gulp/sass');
var server = require('./gulp/server');

// arg
var argv = require('minimist')(process.argv.slice(2));
var isWatch = argv._[0] === 'watch';

// config
var config = {
    source: 'app',
    dest: isWatch ? 'www' : 'build',
    component: 'components',
    server: {
        dir: 'www',
        port: 1024,
        // 默认显示 index.html
        index: true
    },
    views: ['app/views/*.html'],
    styles: ['app/**/*.scss'],
    scripts: ['app/**/*.js'],

    components: {}
};

// register tasks
gulp.task('uglify', uglify(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('sass', sass(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));
gulp.task('start', ['nunjucks', 'sass', 'uglify'], function() {
    gulp.watch(config.views, ['nunjucks']);
    gulp.watch(config.styles, ['sass']);
    gulp.watch(config.scripts, ['uglify']);
});
