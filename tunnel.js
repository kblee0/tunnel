var tunnel = require('tunnel-ssh');
var fs = require('fs');
var log = require('./tlog');
var JSON5 = require('json5');
var config = 'config.json';

if (process.argv[2] !== undefined) {
    config = process.argv[2];
}

log.info('config file name:', config);
try {
    var configList = JSON5.parse(fs.readFileSync(config));
} catch (err) {
    log.error(config, 'file parsing failed.\n', err);
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
    if (config.keepAlive === undefined) {
        config.keepAlive = true;
    }
    var server = tunnel(config, function (error) {
        if (error) {
            log.error(config.name, 'Server failed to start.', error);
            process.exit(1);
        }
        log.info(config.name, 'Tunnel server has been started.');
    });
    server.on('error', function (error) {
        log.error(config.name, 'an error has occurred.\n', error);
        server.emit('close');
    });
    // The server shutdown when all clients are disconnected.
    server.on('close', function () {
        if (!config.keepAlive) {
            log.info(config.name, 'the server has been shutdown.');
        }
    });
    return server;
}

configList.forEach((config) => {
    start_tunnel(config);
});
