var path = require('path');

module.exports = {
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
    getBanner: function (file, config) {
        var filename = path.basename(file.path);
        var now = new Date();
        var dateString = 'YY-DD-MM h:m:s'.replace('YY', now.getFullYear())
            .replace('DD', now.getDate())
            .replace('MM', now.getMonth())
            .replace('h', now.getHours())
            .replace('m', now.getMinutes())
            .replace('s', now.getSeconds());

        return config.banner
            .replace('${filename}', filename)
            .replace('${date}', dateString);
    }
};
