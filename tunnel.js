var tunnel = require('tunnel-ssh');
var fs = require('fs');
var log = require('./tlog');

log.info('load config: ' + process.argv[2]);
try {
    var configList = JSON.parse(fs.readFileSync(process.argv[2]));
} catch (err) {
    log.error(process.argv[2], 'file parsing error.\n', err);
    process.exit(1);
}

function start_tunnel(config) {
    if (config.privateKey === undefined && config.privateKeyFile != undefined) {
        try {
            config.privateKey = fs.readFileSync(config.privateKeyFile);
        } catch (err) {
            log.error(config.privateKeyFile, 'file read error.\n', err);
        }
    }
    if (config.name === undefined) {
        if (config.localHost == undefined) {
            config.name = 'localhost:' + config.localPort;
        } else {
            config.name = config.localHost + ':' + config.localPort;
        }
    }
    var server = tunnel(config, function(error) {
        if (error) {
            log.error(config.name, 'startup failed: ', error);
            process.exit(1);
        }
        log.info(config.name, 'tunnel started.');
    });
    server.on('error', function(error) {
        log.error(config.name, 'error happened.\n', error);
        process.exit(1);
    });
    // The server shutdown when all clients are disconnected.
    server.on('close', function() {
        log.info(config.name, 'tunnel server closed.');
        start_tunnel(config);
    });
    return server;
}

configList.forEach(config => {
    start_tunnel(config);
});
