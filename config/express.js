
/**
 * Module dependencies.
 */

var express = require('express')
  , flash = require('connect-flash')
  , winston = require('winston')
  , helpers = require('view-helpers')
  , pkg = require('../package.json')
  , config = require('./config')
  , i18n = require("i18n")

var env = process.env.NODE_ENV || 'development'

//configure i18n
i18n.configure({
    locales:[config.locale],
    directory: __dirname + '/../locales',
    updateFiles: env=='development',
    defaultLocale: 'en',
})

module.exports = function (app, config, passport, sessionstore) {

  app.set('showStackError', true)

  // should be placed before express.static
  app.use(express.compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  app.use(express.favicon())
  app.use(express.static(config.root + '/public'))

  // Logging
  // Use winston on production
  var log
  if (env !== 'development') {
    log = {
      stream: {
        write: function (message, encoding) {
          winston.info(message)
        }
      }
    }
  } else {
    log = 'dev'
  }
  // Don't log during tests
  if (env !== 'test') app.use(express.logger(log))

  // set views path, template engine and default layout
  app.set('views', config.root + '/views')
  app.set('view engine', 'jade')

  app.configure(function () {
    // expose package.json to views
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      res.locals.url = config.url
      next()
    })

    // cookieParser should be above session
    app.use(express.cookieParser())

    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())

    // express/mongo session storage
    app.use(express.session({
      secret: 'itsnosecrethaha',
      store: sessionstore,
      key:  'express.sid'
    }))

    // use passport session
    app.use(passport.initialize())
    app.use(passport.session())

    // connect flash for flash messages - should be declared after sessions
    app.use(flash())

    // should be declared after session and flash
    app.use(helpers(pkg.name))

    var isFromFacebook = function(req) {
      return req.body.signed_request && req.body.fb_locale && req.query.fb;
    }
    var csrf = express.csrf();

    // adds CSRF support
    if (env !== 'test') {
      app.use(function (req, res, next) {
        if (!isFromFacebook(req)) {
          csrf(req, res, next);
        } else {
          next();
        }
      })

      // This could be moved to view-helpers :-)
      app.use(function(req, res, next){
        if (!isFromFacebook(req)) {
          res.locals.csrf_token = req.csrfToken()
        }
        next()
      })
    }

    // default: using 'accept-language' header to guess language settings
    app.use(i18n.init);

    //set env in locals and make sure the locale is OK
    app.use(function(req, res, next){

   // express helper for natively supported engines
      res.locals.__ = res.__ = function() {
          return i18n.__.apply(req, arguments);
      };

      res.locals.env = env;
      res.locals.locale = config.locale;
      res.locals.fb = config.facebook;
      if (env !== 'development') {
        if (config.locale && i18n.getLocale(req) !== config.locale) {
          if (config.localized_url && config.localized_url[i18n.getLocale(req)]) {
            // redirect to proper address if locale is not OK
            //res.redirect(config.localized_url[i18n.getLocale(req)]);
            //show alert to user
            res.locals.localized_url = config.localized_url[i18n.getLocale(req)];
          }
        }
      }
      next()
    })

    // routes should be at the last
    app.use(app.router)

    // assume "not found" in the error msgs
    // is a 404. this is somewhat silly, but
    // valid, you can do whatever you like, set
    // properties, use instanceof etc.
    app.use(function(err, req, res, next){
      // treat as 404
      if (err.message
        && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
        return next()
      }

      // log it
      // send emails if you want
      console.error(err.stack)

      //get translation
      res.locals.__ = res.__ = function() {
          return i18n.__.apply(req, arguments);
      };
      var error = (~env.indexOf('dev')?err.stack:'');
      // error page
      res.status(500).render('500', { error: error })
    })

    // assume 404 since no middleware responded
    app.use(function(req, res, next){
      res.status(404).render('404', {
        url: req.originalUrl,
        error: 'Not found'
      })
    })



  })

  // development env config
  app.configure('development', function () {
    app.locals.pretty = true
  })
}