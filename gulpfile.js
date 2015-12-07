var gulp = require('gulp');

// tasks
var copy     = require('./gulp/copy');
var uglify   = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass     = require('./gulp/sass');
var server   = require('./gulp/server');
var clean    = require('./gulp/clean');
var start    = require('./gulp/start');
var gulpif   = require('gulp-if');

var spritesmith = require("gulp-spritesmith");

// args
var argv    = require('minimist')(process.argv.slice(2));
var isWatch = argv._[0] === 'start';

// config
var config = {
    // 文件目录
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

    name: 'Project name',
    version: '1.0.0',
    production: '//static.360buyimg.com/',

    // 是否替换css中的路径为线上路径
    // 线上生产环境路径为 production + version + css相对地址
    replaceUrl: isWatch ? false : true,

    // 匹配待目标文件
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/**/*.scss'],
    scripts: ['app/**/*.js'],
    images: ['./app/components/**/*.+(jpg|png|gif)'],

    // 组件 mapping, list
    components: {},

    isWatch: isWatch
};

// register tasks
gulp.task('sprites', function () {
    return  gulp.src('app/components/main/i/*.png', { base: config.source })
        .pipe(spritesmith({
            imgName: 'sprite.png',
            styleName: 'sprite.css',
            imgPath: '../components/main/i/sprite.png'
        }))
        .pipe(gulpif('*.png', gulp.dest(config.dest, { base: config.source })))
        .pipe(gulpif('*.css', gulp.dest(config.dest, { base: config.source })));
});

gulp.task('uglify', uglify(config));
gulp.task('copy', copy(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('sass', sass(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));
gulp.task('start',
    ['nunjucks', 'uglify', 'sass', 'copy', 'server'],
    start(config)
);
