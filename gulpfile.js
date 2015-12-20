var gulp     = require('gulp');

// tasks
var copy     = require('./gulp/copy');
var sprite   = require('./gulp/sprite');
var uglify   = require('./gulp/uglify');
var nunjucks = require('./gulp/nunjucks');
var sass     = require('./gulp/sass');
var server   = require('./gulp/server');
var ftp      = require('./gulp/ftp');
var build    = require('./gulp/build');
var clean    = require('./gulp/clean');
var start    = require('./gulp/start');

// Args
var argv     = require('minimist')(process.argv.slice(2));
var isWatch  = argv._[0] === 'start';
var isRelease = argv._[0] === 'release';

// Configuration
var config = {
    name: 'main',
    version: '1.0.0',
    cdn: '//static.360buyimg.com',

    // 代码头注释
    /*!base.js => 2015-51-20 17:21:6 */
    banner: '/*!${filename} => ${date} */\n',

    // 文件目录
    source: 'app',
    dest: 'build',
    clean: ['www', 'build'],
    component: 'components',
    componentFile: 'components/{name}/{name}.html',
    view: 'views',

    // 匹配待目标文件
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/components/**/*.scss'],
    scripts: ['app/components/**/*.js'],
    images: ['./app/components/**/*.+(jpg|png|gif)', '!sprite-*.+(jpg|png|gif)'],
    tests: ['./app/tests/**/*'],

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

    // 部署远程 ftp 测试服务器
    deploy: {
        host:     '127.0.0.1',
        user:     'ftpuser',
        password: 'ftppass',
        parallel: 10,
        src: 'build/**',
        dest: './'
    }
};

// Runtime val
config._argv = argv;
config._isWatch = isWatch;
config._isRelease = isRelease;
config._isDebug = isWatch || argv.d;
config._components = {};

config.version = argv.v || config.version;
/**
 * 是否替换 css 中的图片路径为绝对路径
 * 线上生产环境路径为 cdn + production + css相对地址
 * example:
 * source> /app/components/main/main.scss [reference] i/bg.png
 * production> {cdn}/main/1.0.0/app/components/main/i/bg.png
 */
config.replaceCSSUrl = !isWatch;
config.production = '/' + config.name + '/' + config.version;
config.dest = isWatch
    ? config.server.dir
    : config.dest + config.production;


// Meta tasks
gulp.task('sprite', sprite(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('uglify', uglify(config));
gulp.task('copy', copy(config));
gulp.task('sass', ['sprite', 'copy'], sass(config));
gulp.task('ftp', ftp(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));

// Workflow tasks
gulp.task('start', ['nunjucks', 'uglify', 'sass', 'copy', 'server'], start(config));

// Deployment tasks
gulp.task('build', build(config));
gulp.task('deploy', ['build'], function (cb) {
    ftp(config)(cb);
});
gulp.task('release', ['build'], function() {});
