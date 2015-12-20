var assert = require('assert');

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
});
