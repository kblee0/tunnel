var tunnel = require('tunnel-ssh');
var fs = require('fs');
var JSON5 = require('json5');
require('console-stamp')(console, {
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label(7)'
});

var config = 'config.json';

if (process.argv[2] !== undefined) {
    config = process.argv[2];
}

console.info('config file name:', config);
try {
    var configList = JSON5.parse(fs.readFileSync(config));
} catch (err) {
    console.error(config, 'file parsing failed.\n', err);
    process.exit(1);
}

function start_tunnel(config) {
    if (config.privateKey === undefined && config.privateKeyFile != undefined) {
        try {
            config.privateKey = fs.readFileSync(config.privateKeyFile);
        } catch (err) {
            console.error(config.privateKeyFile, 'file read error.\n', err);
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
            console.error(config.name, 'Tunnel server failed to start.', error);
        }
        console.info(config.name, 'Tunnel server has been started.');
    });
    server.on('error', function (error) {
        log.error(config.name, 'an error has occurred.\n', error);
    });
    return server;
}

configList.forEach((config) => {
    start_tunnel(config);
});
