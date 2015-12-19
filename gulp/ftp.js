var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

var _ = require('lodash');

module.exports = function (config) {
    var ftpConfig = _.assign(config.deploy, {
        log: function (type, file) {
            if (/UP/.test(type)) {
                return gutil.log.call(null, type, file);
            }
        }
    });
    var conn = ftp.create(ftpConfig);

    return function(cb) {
        cb = cb || function() {};

        gulp.src(ftpConfig.src, {
                base: config.dest,
                buffer: false
            })
            .pipe( conn.newer(ftpConfig.dest) )
            .pipe( conn.dest(ftpConfig.dest) )
            .on('end', cb);
    }
};
