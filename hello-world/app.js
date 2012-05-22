"use strict";
/**
 * Module dependencies.
 */

var express = require('express');
var mongo = require('mongoskin');
var config = require('./config');
//var routes = require('./routes');

config.setupenv();
var app = module.exports = express.createServer();
var db = mongo.db(process.env.MONGO_URI);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
//app.get('/', routes.index);
require('./boot')(app, db);

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
