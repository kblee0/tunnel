const tunnel = require('tunnel-ssh');
const fs = require('fs');
const JSON5 = require('json5');
require('console-stamp')(console, {
    format: ':date(yyyy/mm/dd HH:MM:ss.l) :label(7)'
});

let configFileName = 'config.json';

if (process.argv[2] !== undefined) {
    configFileName = process.argv[2];
}

console.info('config file name:', configFileName);

try {
    var config = JSON5.parse(fs.readFileSync(configFileName));
} catch (err) {
    console.error(configFileName, 'file parsing failed.\n', err);
    process.exit(1);
}

config.tunnels.forEach((tunnelOptions) => {
    tunnel.createTunnel(
        config.defaultOptions.tunnelOptions,
        tunnelOptions.serverOptions,
        tunnelOptions.sshOptions ? tunnelOptions.sshOptions : config.defaultOptions.sshOptions,
        tunnelOptions.forwardOptions)
        .then(([server, conn], error)=>{
            if(tunnelOptions.name === undefined || tunnelOptions.name === null) {
                tunnelOptions.name = `${tunnelOptions.serverOptions.host}:${tunnelOptions.serverOptions.port} -> ${tunnelOptions.forwardOptions.dstAddr}:${tunnelOptions.forwardOptions.dstPort}`;
            }
            if(error) {
                console.error(tunnelOptions.name, "createTunnel error", error);
                process.exit(1);
            }
            console.info('Tunnel started.::', tunnelOptions.name);
            server.on('error',(e)=> {
                console.log(tunnelOptions.name, "server error.", e);
            });
            conn.on('error', (e)=>{
                console.log(tunnelOptions.name, "connection error.", e);
            });
        });
});
