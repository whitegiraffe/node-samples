
/**
 * Module dependencies.
 */

var express = require('express');
//var mongo = require('mongoskin');
var socketio = require('socket.io');
var config = require('./config');

config.setupenv();
var app = module.exports = express.createServer();
//var db = mongo.db(process.env.MONGO_URI);
var db = null;
var io = socketio.listen(app);

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


// Loading routes
require('./boot')(app, db, io);

app.listen(process.env.PORT, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

