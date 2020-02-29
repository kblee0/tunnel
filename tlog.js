'use strict';

const Console = require('console').Console;

var console;

console = new Console(process.stdout, process.stderr);

var logLevel = 'DEBUG';
var logModule = '-';

const levelList = {
    TRACE: { value: 5000, message: '[TRACE]' },
    DEBUG: { value: 10000, message: '[DEBUG]' },
    INFO: { value: 20000, message: '[INFO]' },
    WARN: { value: 30000, message: '[WARN]' },
    ERROR: { value: 40000, message: '[ERROR]' },
    FATAL: { value: 50000, message: '[FATAL]' },
};

Date.prototype.format = function(f) {
    if (!this.valueOf()) return ' ';

    var d = this;

    var dstr = {
        YYYY: ('000' + d.getFullYear()).slice(-4),
        YY: ('0' + d.getFullYear()).slice(-2),
        MM: ('0' + (d.getMonth() + 1)).slice(-2),
        DD: ('0' + d.getDate()).slice(-2),
        HH: ('0' + d.getHours()).slice(-2),
        hh: ('0' + (d.getHours() % 12 || 12)).slice(-2),
        mm: ('0' + d.getMinutes()).slice(-2),
        ss: ('0' + d.getSeconds()).slice(-2),
        SSS: ('00' + d.getMilliseconds()).slice(-3),
    };

    return f.replace(/(YYYY|SSS|YY|MM|DD|HH|hh|mm|ss)/gi, function($1) {
        switch ($1) {
            case 'YYYY':
                return dstr.YYYY;
            case 'YY':
                return dstr.YY;
            case 'MM':
                return dstr.MM;
            case 'DD':
                return dstr.DD;
            case 'HH':
                return dstr.HH;
            case 'hh':
                return dstr.HH;
            case 'mm':
                return dstr.mm;
            case 'ss':
                return dstr.ss;
            case 'SSS':
                return dstr.SSS;
            default:
                return $1;
        }
    });
};

function setLevel(level) {
    if (levelList[level] == undefined) {
        logLevel = 'DEBUG';
    } else {
        logLevel = level;
    }
    return this;
}

function setModule(module) {
    logModule = module;
    return this;
}

function getTimestamp() {
    //return '[' + timestamp('HH:mm:ss') + ']';
    return '[' + new Date().format('YYYY-MM-DD HH:mm:ss.SSS') + ']';
}

function _log(logEvent) {
    if (logEvent.level && levelList[logEvent.level].value < levelList[logLevel].value) {
        return;
    }

    process.stdout.write(logEvent.time + ' ' + logModule + ' ' + levelList[logEvent.level].message + ' ');
    console.log.apply(console, logEvent.data);
}

function log() {
    console.log();
    _log({
        time: getTimestamp(),
        data: arguments,
    });
    return this;
}

function debug() {
    console.log();
    _log({
        level: 'DEBUG',
        time: getTimestamp(),
        data: arguments,
    });
    return this;
}

function info() {
    _log({
        level: 'INFO',
        time: getTimestamp(),
        data: arguments,
    });
    return this;
}

function warn() {
    _log({
        level: 'WARN',
        time: getTimestamp(),
        data: arguments,
    });
    return this;
}

function error() {
    _log({
        level: 'ERROR',
        time: getTimestamp(),
        data: arguments,
    });
    return this;
}

module.exports = log;
module.exports.debug = debug;
module.exports.info = info;
module.exports.warn = warn;
module.exports.error = error;
module.exports.setLevel = setLevel;
module.exports.setModule = setModule;
