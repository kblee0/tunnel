'use strict';

var Console = require('console').Console;
//var timestamp = require('time-stamp');
//var nodeVersion = require('parse-node-version')(process.version);

// Needed to add this because node 10 decided to start coloring log output randomly
var console;
//if (nodeVersion.major >= 10) {
  // Node 10 also changed the way this is constructed
//  console = new Console({
//    stdout: process.stdout,
//    stderr: process.stderr,
//    colorMode: false,
//  });
//} else {
  console = new Console(process.stdout, process.stderr);
//}

Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";

    var d = this;

    var dstr = [(d.getFullYear() % 1000),(d.getMonth() + 1),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds()];

    dstr.forEach(function(n,i,s) {
        if(n<10) s[i] = '0' + s[i];
    });
    
    return f.replace(/(yyyy|yy|MM|dd|hh|mm|ss)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return dstr[0];
            case "MM": return dstr[1];
            case "dd": return dstr[2];
            case "hh": return dstr[3];
            case "mm": return dstr[4];
            case "ss": return dstr[5];
            default: return $1;
        }
    });
};


function getTimestamp() {
  //return '[' + timestamp('HH:mm:ss') + ']';
  return '[' + new Date().format('yyyy-MM-dd hh:mm:ss')  + ']';
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
