var path = require('path');
var copy   = require('./copy');
var uglify = require('./uglify');
var sass   = require('./sass');
var clean  = require('./clean');
var ftp    = require('./ftp');

var Util   = require('./utils');

module.exports = function (config) {
    return function (cb) {
        var singleFile = config._argv.f;

        clean(config)();

        if (!singleFile) {
            uglify(config)(function() {
                sass(config)(function () {
                    copy(config)(function () {
                        ftp(config)();
                    });
                });
            });

        } else {
            if (Util.isExists(singleFile)) {
                var extname = path.extname(singleFile);

                switch(extname) {
                    case '.js':
                        uglify(config, singleFile)(ftp(config));
                        break;
                    case '.scss':
                        sass(config, singleFile)(ftp(config));
                        break;
                    case '.html':
                        nunjucks(config, singleFile)(ftp(config));
                        break;
                    default:
                        copy(config, singleFile)(ftp(config));
                }
            } else {
                console.log('The file [%s] does not exists.', singleFile);
            }
        }

    }
};
