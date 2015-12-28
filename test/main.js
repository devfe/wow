var fs   = require('fs');
var path = require('path');
var assert = require('assert');
var expect = require('chai').expect;


describe('Util', function() {

    var Util = require('../gulp/utils');

    describe('#hasContents()', function () {

        it('should has contents', function () {
            assert.equal(true, Util.hasContents(__filename));
        });
        it('should not has contents', function () {
            assert.equal(false, Util.hasContents(__dirname + '/empty.js'));
        });
    });
    describe('#isAbsUrl()', function () {
        it('should a absolute url', function () {
            assert.equal(true, Util.isAbsUrl('//'));
            assert.equal(true, Util.isAbsUrl('http://'));
            assert.equal(true, Util.isAbsUrl('https://'));
        });
        it('should not a absolute url', function () {
            assert.equal(false, Util.isAbsUrl('/app'));
            assert.equal(false, Util.isAbsUrl('app/js'));
            assert.equal(false, Util.isAbsUrl('../app'));
        });
    });
    describe('#dirToPath()', function () {
        it('should a path', function () {
            assert.equal('path/to/file', Util.dirToPath('path\\to/file'));
            assert.equal('/path/to/file', Util.dirToPath('\\path\\to\\file'));
        });
    });
    describe('#getTag()', function () {
        it('should a script tag', function () {
            assert.equal('<script src="{{source}}"></script>', Util.getTag('script'));
        })
    });
});

describe('uglify', function () {
    var config = require('../config');
    var uglify = require('../gulp/uglify');
    var sass = require('../gulp/sass');
    var nunjucks = require('../gulp/nunjucks');

    var testSrc = 'src';

    var script = path.join( testSrc, 'compress.js' );
    var style = path.join( testSrc, 'compile.scss' );
    var view = path.join( testSrc, 'nunjucks.html' );


    // change env
    config.scripts = [path.join(__dirname, script)];
    config.styles = [path.join(__dirname, style)];
    config.views = [path.join(__dirname, view)];
    config.dest = '.tmp';
    config._isRelease = false;
    config._isWatch = false;
    config.source = process.cwd();

    describe('#uglify()', function () {
        it('should a get compressed content', function (done) {
            uglify(config)(function () {
                var res = fs.readFileSync(
                    path.join(config.dest,
                    path.basename(__dirname),
                    script), 'utf8');

                expect(res).to.equal('!function(){var o="Wow";return"Hello World."+o}();');
                done();
            });
        });
    });
    describe('#sass()', function () {
        it('should a get compiled css content', function (done) {
            sass(config)(function () {
                var res = fs.readFileSync(
                    path.join(config.dest,
                        path.basename(__dirname),
                        style.replace(/\.scss$/, '.css')), 'utf8');

                expect(res).to.equal('body{width:100px}body .box{height:200px}');
                done();
            });
        });
    });
    describe('#nunjucks()', function () {
        it('should a get compiled nunjucks content', function (done) {
            nunjucks(config)(function () {
                var res = fs.readFileSync(
                    path.join(config.dest,
                        path.basename(__dirname),
                        view), 'utf8');

                expect(res.trim()).to.equal('<div>6</div>');
                done();
            });
        });
    });

});
