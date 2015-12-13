var http = require('http');
var shs = require('static-http-server');

module.exports = function(config) {
    return function() {
        shs(config.server.dir, {
            index: config.server.index,
            port: config.server.port
        });
    };
};
