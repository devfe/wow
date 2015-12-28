var fs   = require('fs');
var path = require('path');


module.exports = {
    // file
    hasContents: function (file) {
        if (this.exists(file)) {
            return fs.readFileSync(file, 'utf8') !== '';
        } else {
            return false;
        }
    },
    exists: function(file) {
        return fs.existsSync(file);
    },
    isDir: function (file) {
        return fs.lstatSync(file).isDirectory();
    },
    // dir,url
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
    },
    // tag template
    getTag: function (tagname) {
        switch (tagname) {
            case 'link':
                return '<link type="text/css" rel="stylesheet" href="{{source}}" />';
            case 'script':
                return '<script src="{{source}}"></script>';
            default:
                return '<'+ tagname +'></'+ tagname +'>'
        }
    },
    getTimeStr: function () {
        var now = new Date();
        var dateString = 'YY-DD-MM h:m:s'.replace('YY', now.getFullYear())
            .replace('DD', now.getDate())
            .replace('MM', now.getMonth())
            .replace('h', now.getHours())
            .replace('m', now.getMinutes())
            .replace('s', now.getSeconds());

        return dateString;
    }
};
