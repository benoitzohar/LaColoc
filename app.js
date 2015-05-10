
/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    socketio = require('socket.io'),
    passportSocketIo = require("passport.socketio"),
    mongoose = require('mongoose'),
    expressSession = require('express-session'),
    mongoStore = require('connect-mongo')(expressSession),
    os = require("os"),
    config = require('./config/config');
  
 // Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 }, auto_reconnect:true } };
  mongoose.connect(config.db, options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

// Bootstrap models
var models_path = __dirname + '/models';
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
});

// bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

var sessionstore = new mongoStore({
    url: config.db,
    collection : 'sessions',
});

// Socket settings
var socket = require('./config/socket')();

// express settings
require('./config/express')(app, config, passport, sessionstore, socket);

// Start the app by listening on <port>
var port = process.env.PORT || 3000;

var http = require('http').Server(app);
var io = socketio(http);
http.listen(port,function(){
  console.log('Lacoloc app started on port '+port);  
});

//init socket
socket.initSocket(express, io, passportSocketIo, new mongoStore({
    url: config.db,
    collection : 'sessions',
}));

// expose app
exports = module.exports = app;