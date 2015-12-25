var path        = require('path');
var argv        = require('minimist')(process.argv.slice(2));
var isWatch     = argv._[0] === 'start';
var isRelease   = argv._[0] === 'release';
var isComponent = argv._[0] === 'component';

// Configuration
var config = {
    name: 'main',
    version: '1.0.0',
    domain: '//your_cdn_server.com',

    // 代码头注释
    /*!base.js => 2015-51-20 17:21:6 */
    banner: '/*!{{ filename }} => {{ date }} */\n',

    // 文件目录
    source: 'app',
    dest: 'build',
    component: {
        dir: 'components',
        refPath: 'components/{name}/{name}.html',
        config: 'config.js'
    },
    view: 'views',
    clean: ['.www', 'build'],

    // 匹配待目标文件
    views: ['app/views/*.html', 'app/{views,components}/*/*.html'],
    styles: ['app/components/**/*.scss'],
    scripts: ['app/components/**/*.js', '!app/components/**/config.js'],
    components: ['app/components/*/*'],
    images: ['./app/components/**/*.+(jpg|png|gif)', '!i/sprite-*.+(jpg|png|gif)'],
    tests: ['./app/tests/**/*'],

    sprite: {
        src: ['./app/components/**/sprite-*.+(jpg|png|gif)'],
        dest: './app/components/main',
        imgName: 'i/_sprite.png',
        cssName: '_sprite.scss'
    },

    // 本地静态服务器
    server: {
        dir: '.www',
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
config._isComponent = isComponent;
config._isDebug = isWatch || argv.d;
config._components = {};

config.version = argv.v || config.version;
/**
 * 是否替换 css 中的图片路径为绝对路径
 * 线上生产环境路径为 domain + production + css相对地址
 * example:
 * source> /app/components/main/main.scss [reference] i/bg.png
 * production> {domain}/main/1.0.0/app/components/main/i/bg.png
 */
config.replaceCSSUrl = !isWatch;
config.production = '/' + config.name + '/' + config.version;
config.dest = isWatch
    ? config.server.dir
    : config.dest + config.production;

config.deploy.dest = isWatch
    ? './'
    : path.join(config.deploy.dest, config.production);

module.exports = config;
