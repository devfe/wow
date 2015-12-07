var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var modify = require('gulp-modify');
var gulpif = require('gulp-if');
var livereload = require('gulp-livereload');

var _ = require('lodash');

var Util = {
    relativeDir: function (dir) {
        return path.relative(process.cwd(), dir);
    },
    dirToPath: function(dir) {
        dir = path.normalize(dir);
        return dir.replace(/\\/g, '/');
    },
    isAbsUrl: function (url) {
        return /^http:|https:|\/\//.test(url);
    },
    isDataUri: function (url) {
        return /^data:image/.test(url);
    }
};

function replaceUrl(content, file, config) {
    // 匹配所有的 url(...)
    var re = /url\s*\(\s*(['"]?)([^"'\)]*)\1\s*\)/gi;
    var matches = content.match(re);
    var urls = [];

    if ( matches && matches.length ) {
        // 去掉重复引用的url
        _.uniq(matches).forEach(function (match) {
            // 去掉多余字符如：url(,),",'
            match = match.replace(/url\(|\)|"|'/g, '');

            if ( !Util.isAbsUrl(match) && !Util.isDataUri(match) ) {
                var dirname = path.dirname(match);
                var filedir = path.dirname(file);
                var basename = path.basename(match);

                var production = path.join(
                    config.production,
                    config.version,
                    // 找出当前样式文件引用url路径相对于项目路径
                    path.relative(process.cwd(), path.resolve(filedir, dirname)),
                    basename
                );

                urls.push({
                    path: match,
                    production: Util.dirToPath(production)
                });
            }
        });

        urls.forEach(function (url) {
            var urlRE = new RegExp(url.path, 'gi');
            content = content.replace(urlRE, url.production);
        });
    }

    return content;
}

module.exports = function(config, file) {
    var src = file || config.styles;

    return function() {
        return sass(src, { base: config.source })
            .on('error', sass.logError)
            .pipe(gulpif(config.replaceUrl, modify({
                fileModifier: function(file, contents) {
                    return replaceUrl(contents, file.path, config);
                }
            })))
            .pipe(gulp.dest(config.dest))
            .pipe(gulpif(config.isWatch, livereload()));
    }
};
