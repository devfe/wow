var http = require('http');
var finalhandler = require('finalhandler');
var serveIndex   = require('serve-index');
var serveStatic  = require('serve-static');

module.exports.server = function(dir, port, options) {
    port || 1024;

    var index = serveIndex(dir, {
        icons: true,
        hidden: true
    });

    var serve = serveStatic(dir, {
        index: options.index
    });

    // Create server
    var server = http.createServer(function onRequest(req, res) {
        var done = finalhandler(req, res);
        serve(req, res, function onNext(err) {
            if (err) return done(err);
            index(req, res, done);
        });
    });

    // Listen
    server.listen(port);

    console.log('\n>>> Server is listen on port: ' + port);
};
