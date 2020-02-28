var configList = [{
  username: 'ops',
  password:'jkl123#',
  host: '192.168.4.12',
  port: 22,
  dstHost: 'localhost',
  dstPort: 22,
  localHost: '0.0.0.0',
  localPort: 8888
},
{
    username: 'ops',
    password:'jkl123#',
    host: 'localhost',
    port: 8888,
    dstHost: 'localhost',
    dstPort: 8080,
    localPort: 8080
  }];


var tunnel = require('tunnel-ssh');
var fs = require('fs');
var log = require('./tlog');

//log.info('load config: ' + process.argv[2]);

//var config = JSON.parse(fs.readFileSync(process.argv[2]));

function start_tunnel(config) {
    if( config.privateKey === undefined && config.privateKeyFile != undefined) {
        config.privateKey = fs.readFileSync(config.privateKeyFile);
    }
    if(config.name === undefined) {
        if(config.localHost == undefined) {
            config.name = 'localhost:' + config.localPort;
        }
        else {
            config.name = config.localHost + ':' + config.localPort;
        }
    }
    var server = tunnel( config, function( error, s ) {
        if(error) {
            log.error(config.name, 'startup failed: ', error);
            process.exit(1);
        }
        log.info( config.name, 'tunnel started.')
    });
    server.on('error', function(error) {
        log.error(config.name, "error happened.\n", error);
        process.exit(1);
    });
    // The server shutdown when all clients are disconnected.
    server.on('close', function() {
        log.info(config.name, 'tunnel server closed.');
        start_tunnel( config );
    });
    return server;    
}

// log.log('Starting tunnel', config.name);

configList.forEach(config => {
    start_tunnel( config );
});
