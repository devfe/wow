var http = require('http');
var finalhandler = require('finalhandler');
var serveIndex   = require('serve-index');
var serveStatic  = require('serve-static');

module.exports = function(config) {
    return function() {
        var index = serveIndex(config.server.dir, {
            icons: true,
            hidden: true
        });

        var serve = serveStatic(config.server.dir, {
            index: config.server.index
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
        server.listen(config.server.port);

        console.log('\n>>> Server is listen on port: ' + config.server.port);        
    };
    
};
