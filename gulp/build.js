var path     = require('path');
var copy     = require('./copy');
var uglify   = require('./uglify');
var sass     = require('./sass');
var clean    = require('./clean');
var ftp      = require('./ftp');
var nunjucks = require('./nunjucks');

var async = require('async');
var Util  = require('./utils');

function buildAll(config, cb) {
    var fn = [
        clean(config),
        uglify(config),
        sass(config),
        copy(config)
    ];
    if (config._argv.t) {
        fn.push(nunjucks(config));
    }
    async.series(fn, function (err, result) {
        if (err) { console.log(err); }
        cb();
    });
}

function buildSingle(config, singleFile, cb) {
    if (!Util.exists(singleFile)) {
        return console.log('The file [%s] does not exists.', singleFile);
    }
    if (Util.isDir(singleFile)) {
        return console.log('Directory are not supported, ' +
            'please give a filename.')
    }
    var extname = path.extname(singleFile);
    var fn = [clean(config)];

    switch(extname) {
        case '.js':
            fn.push(uglify(config, singleFile));
            break;
        case '.scss':
            fn.push(sass(config, singleFile));
            break;
        case '.html':
            fn.push(nunjucks(config, singleFile));
            break;
        default:
            fn.push(copy(config, singleFile));
    }

    async.series(fn, function (err, result) {
        if (err) { console.log(err); }
        cb();
    });
}

module.exports = function (config) {
    return function (cb) {
        var singleFile = config._argv.f;

        if (!singleFile) {
            buildAll(config, cb);
        } else {
            buildSingle(config, singleFile, cb);
        }
    }
};
