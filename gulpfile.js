var gulp     = require('gulp');

// tasks
var copy      = require('./gulp/copy');
var sprite    = require('./gulp/sprite');
var uglify    = require('./gulp/uglify');
var nunjucks  = require('./gulp/nunjucks');
var sass      = require('./gulp/sass');
var server    = require('./gulp/server');
var ftp       = require('./gulp/ftp');
var component = require('./gulp/component');
var build     = require('./gulp/build');
var clean     = require('./gulp/clean');
var start     = require('./gulp/start');

var config    = require('./config');

// Meta tasks
gulp.task('sprite', sprite(config));
gulp.task('nunjucks', nunjucks(config));
gulp.task('component', component(config));
gulp.task('uglify', uglify(config));
gulp.task('copy', ['sprite'], copy(config));
gulp.task('sass', ['copy'], sass(config));
gulp.task('ftp', ftp(config));
gulp.task('server', server(config));
gulp.task('clean', clean(config));

// Workflow tasks
gulp.task('start', start(config));

// Deployment tasks
gulp.task('build', build(config));
gulp.task('deploy', ['build'], ftp(config));
gulp.task('release', ['build'], function() {
    // TODO
});
