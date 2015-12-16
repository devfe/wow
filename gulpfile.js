var gulp     = require('gulp');

// tasks
var copy     = require('./gulp/copy');
var sprite   = require('./gulp/sprite');
var uglify   = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass     = require('./gulp/sass');
var server   = require('./gulp/server');
var ftp      = require('./gulp/ftp');
var clean    = require('./gulp/clean');
var start    = require('./gulp/start');

// Args
var argv     = require('minimist')(process.argv.slice(2));
var isWatch  = argv._[0] === 'start';
var isRelease = argv._[0] === 'release';

// Configuration
var config = {
    name: 'Project name',
    version: '1.0.0',
    production: '//static.360buyimg.com/item',

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
    view: 'views',

    // 匹配待目标文件
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/**/*.scss'],
    scripts: ['app/**/*.js'],
    images: ['./app/components/**/*.+(jpg|png|gif)', '!sprite-*.+(jpg|png|gif)'],

    sprite: {
        src: ['./app/components/**/sprite-*.+(jpg|png|gif)'],
        dest: './app/components/main',
        imgName: '_sprite.png',
        cssName: '_sprite.scss'
    },

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
    _arg: argv,
    _isWatch: isWatch,
    _isRelease: isRelease,
    // 组件
    _components: {}
};

// Meta tasks
gulp.task('sprite', sprite(config));
gulp.task('uglify', uglify(config));
gulp.task('copy', copy(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('sass', ['sprite'], sass(config));
gulp.task('ftp', ftp(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));

// Workflow tasks
gulp.task('start', ['nunjucks', 'uglify', 'sass', 'copy', 'server'], start(config));

// Deployment tasks
gulp.task('deploy', ftp(config));
gulp.task('release', ['uglify', 'sass', 'copy'], function() {
    // gulp release -t
    if (argv.t) nunjucks(config)();
});
