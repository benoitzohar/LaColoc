
/**
 * Module dependencies.
 */

var express = require('express'),
    fs = require('fs'),
    passport = require('passport'),
    socketio = require('socket.io'),
    passportSocketIo = require("passport.socketio"),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongo')(express),
    http = require('http')
    

// Load configurations
var env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  
 // Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 }, auto_reconnect:true } }
  mongoose.connect(config.db, options)
}
connect()

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err)
})

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect()
})

// Bootstrap models
var models_path = __dirname + '/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})   

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
var server = http.createServer(app);

var sessionstore = new mongoStore({
    url: config.db,
    collection : 'sessions',
})

// express settings
require('./config/express')(app, config, passport, sessionstore)

// Bootstrap routes
require('./config/routes')(app, passport)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
var io = socketio.listen(server);
server.listen(port)
console.log('Express app started on port '+port)

// Socket settings
require('./config/socket')(express, io, passportSocketIo, new mongoStore({
    url: config.db,
    collection : 'sessions',
}))

// expose app
exports = module.exports = app