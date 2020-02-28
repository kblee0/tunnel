'use strict';

const Console = require('console').Console;

var console;

console = new Console(process.stdout, process.stderr);

Date.prototype.format = function(f) {
    if (!this.valueOf()) return ' ';

    var d = this;

    var dstr = [
        d.getFullYear() % 1000,
        d.getMonth() + 1,
        d.getDate(),
        d.getHours(),
        d.getMinutes(),
        d.getSeconds(),
    ];

    dstr.forEach(function(n, i, s) {
        if (n < 10) s[i] = '0' + s[i];
    });

    return f.replace(/(YYYY|YY|MM|DD|HH|mm|ss)/gi, function($1) {
        switch ($1) {
            case 'YYYY':
                return d.getFullYear();
            case 'YY':
                return dstr[0];
            case 'MM':
                return dstr[1];
            case 'DD':
                return dstr[2];
            case 'HH':
                return dstr[3];
            case 'mm':
                return dstr[4];
            case 'ss':
                return dstr[5];
            default:
                return $1;
        }
    });
};

function getTimestamp() {
    //return '[' + timestamp('HH:mm:ss') + ']';
    return '[' + new Date().format('YYYY-MM-dd hh:mm:ss') + ']';
}
function log() {
    var time = getTimestamp();
    process.stdout.write(time + ' ');
    console.log.apply(console, arguments);
    return this;
}

function info() {
    var time = getTimestamp();
    process.stdout.write(time + ' [INFO] ');
    console.info.apply(console, arguments);
    return this;
}

function dir() {
    var time = getTimestamp();
    process.stdout.write(time + ' ');
    console.dir.apply(console, arguments);
    return this;
}

function warn() {
    var time = getTimestamp();
    process.stderr.write(time + ' [WARN] ');
    console.warn.apply(console, arguments);
    return this;
}

function error() {
    var time = getTimestamp();
    process.stderr.write(time + ' [ERROR] ');
    console.error.apply(console, arguments);
    return this;
}

module.exports = log;
module.exports.info = info;
module.exports.dir = dir;
module.exports.warn = warn;
module.exports.error = error;
