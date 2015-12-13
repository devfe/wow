var gulp = require('gulp');

// tasks
var copy     = require('./gulp/copy');
var uglify   = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass     = require('./gulp/sass');
var server   = require('./gulp/server');
var ftp      = require('./gulp/ftp');
var clean    = require('./gulp/clean');
var start    = require('./gulp/start');
var gulpif   = require('gulp-if');

var spritesmith = require("gulp-spritesmith");

// args
var argv    = require('minimist')(process.argv.slice(2));
var isWatch = argv._[0] === 'start';
var isRelease = argv._[0] === 'release';

// config
var config = {
    name: 'Project name',
    version: '1.0.0',
    production: '//static.360buyimg.com/',

    // 是否替换css中的路径为线上路径
    // 线上生产环境路径为 production + version + css相对地址
    replaceUrl: !isWatch,

    // 代码头注释
    /*!base.js => 2015-51-20 17:21:6 */
    banner: '/*!${filename} => ${date} */\n',

    // 文件目录
    source: 'app',
    dest: isWatch ? 'www' : 'build',
    clean: ['www', 'build'],
    component: 'components',

    // 匹配待目标文件
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/**/*.scss'],
    scripts: ['app/**/*.js'],
    images: ['./app/components/**/*.+(jpg|png|gif)'],

    // 本地静态服务器
    server: {
        dir: 'www',
        port: 1024,
        // 默认显示 index.html
        index: false
    },

    // 部署远程ftp测试服务器
    deploy: {
        host:     '127.0.0.1',
        user:     'ftpuser',
        password: 'ftppass',
        parallel: 10,
        src: 'build/**',
        dest: './item/main'
    },

    // val
    isWatch: isWatch,
    isRelease: isRelease,
    // 组件 mapping, list
    components: {},
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
gulp.task('deploy', ftp(config));
gulp.task('release', ['uglify', 'sass', 'copy']);
gulp.task('clean', clean(config));
gulp.task('start', ['nunjucks', 'uglify', 'sass', 'copy', 'server'], start(config));
