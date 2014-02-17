/*!
 * Module dependencies.
 */

var async = require('async'),
    mongoose = require('mongoose')

/**
 * Controllers
 */

var users = require('../controllers/users')
  , groups = require('../controllers/groups')
  , shoppings = require('../controllers/shoppings')
  , expenses = require('../controllers/expenses')
  , invites = require('../controllers/invites')
  , auth = require('./authorization')

/**
 * Route middlewares
 */

var isReady = [auth.requiresLogin, auth.hasGroup];

var groupAuth = [auth.requiresLogin, auth.group.hasAuthorization]
//var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  app.get('*', function(req, res, next) {
    var User = mongoose.model('User')

    if (req.user) {
      User.load(req.user._id, function (err, user) {
        if (err) return next(err)
        if (!user) return next(new Error('not found'))
        req.user = user
        next()
      })
    }
    else next()

  })

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin)
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback)
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin)
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback)

  app.param('userId', users.user)

  // group routes
  app.param('groupid', groups.load)
  app.get('/groups', auth.requiresLogin, groups.index)
  app.get('/groups/new', auth.requiresLogin, groups.new)
  app.post('/groups', auth.requiresLogin, groups.create)
  app.get('/groups/:groupid/edit', groupAuth, groups.edit)
  app.get('/groups/:groupid/select', auth.requiresLogin, groups.select)
  app.get('/groups/:groupid/removeUser', auth.requiresLogin, groups.removeUser)
  
  app.get('/groups/:groupid', isReady, groups.show)
  app.put('/groups/:groupid', groupAuth, groups.update)
  app.del('/groups/:groupid', groupAuth, groups.destroy)

  // expense routes
  app.param('expid', expenses.load)
  app.get('/expenses/new', isReady, expenses.new)
  app.get('/expenses/:expid', isReady, expenses.show)
  app.get('/expenses', isReady, expenses.index)

  // shopping routes
  app.param('shopid', shoppings.load)
  app.get('/shopping/new', isReady, shoppings.new)
  app.get('/shopping/:shopid', isReady, shoppings.show)
  app.get('/shopping', isReady, shoppings.index)
  
  app.post('/invite/send',isReady, invites.send)
  app.get('/invite/valid',auth.requiresLogin, invites.valid)
  app.post('/invite/valid',auth.requiresLogin, invites.valid)


  app.get('/', isReady, users.redirectToDefaultTab)

}