
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../lib/utils')
  , config = require('../config/config');

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.signin = function (req, res) {
  res.redirect('/')
}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function (req, res) {

  if ((req.locale == 'fr' || req.locale === undefined) && /^fr/.test(req.headers["accept-language"]) === false) {
    req.flash('info',"Hello, you don't seem to speak French, maybe you should try our english twin brother at <a href='http://www.flatbuddy.eu/'>http://www.flatbuddy.eu/</a> ");
  }

  res.render('users/login', {
    message: req.flash('error'),
    info: req.flash('info'),
    user: new User()
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

exports.session = login

/**
 * Create user
 */

exports.create = function (req, res) {
  var user_infos = req.body
   //store email as default username for local strategy
  user_infos.username = user_infos.email;
  var user = new User(user_infos)
  user.provider = 'local';

  var crypto = require('crypto')
    , user_hash = crypto.createHash('md5').update(user_infos.email+'').digest('hex')

  user.picture = 'https://www.gravatar.com/avatar/'+user_hash+'?d='+config.url+'/images/default_user_link150.jpg&s=150';
  user.save(function (err) {
    if (err) { console.log('err',err);
      return res.render('user/login', {
        message: utils.errors(err.errors),
        user: user
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}

exports.redirectToDefaultTab = function (req, res) {
  var user = req.profile
  res.render('layouts/default',{
    user: user
  })
  //if (user.last_page)  res.redirect(user.last_page)
  //else res.redirect('/expenses')
}
