"use strict";
/**
 * This source is from express examples "route-loading" (partial editing).
 */

var vm = require('vm');
var fs = require('fs');

module.exports = function(app, db){
  var dir = __dirname + '/routes';
  fs.readdirSync(dir).forEach(function(file){
    var code = fs.readFileSync(dir + '/' + file, 'utf8');
    var context = { app: app, db: db };
    for (var key in global) context[key] = global[key];
    vm.runInNewContext(code, context, file);
  });
};
