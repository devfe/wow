var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

var _ = require('lodash');

module.exports = function (config, file) {
    var src = file || config.images;
    var ftpConfig = _.assign(config.deploy, {
        log: gutil.log
    });
    var conn = ftp.create(ftpConfig);

    return function() {
        return gulp.src(ftpConfig.src, {
                base: config.dest,
                buffer: false
            })
            .pipe( conn.newer(ftpConfig.dest) )
            .pipe( conn.dest(ftpConfig.dest) );
    }
};