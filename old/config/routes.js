/**
 * Module dependencies.
 */

var async = require('async'),
    mongoose = require('mongoose'),
    Recaptcha = require('re-captcha'),
    User = mongoose.model('User'),
    config = require('./config'),
    i18n = require("i18n");

/**
 * Controllers
 */

var users = require('../controllers/users'),
    groups = require('../controllers/groups'),
    shoppings = require('../controllers/shoppings'),
    expenses = require('../controllers/expenses'),
    invites = require('../controllers/invites'),
    auth = require('./authorization');

/**
 * Route middlewares
 */

var isReady = [auth.requiresLogin, auth.hasGroup];
var groupAuth = [auth.requiresLogin, auth.group.hasAuthorization];
var recaptcha = new Recaptcha(config.captcha.pub, config.captcha.priv);

/**
 * Expose routes
 */
module.exports = function(app, passport, socket) {



    /**
     *  init controllers
     **/

    users.initController(socket);
    groups.initController(socket);
    shoppings.initController(socket);
    expenses.initController(socket);
    invites.initController(socket);


    //preload the user at  all request
    app.use(function(req, res, next) {
        var User = mongoose.model('User');

        if (req.user) {
            User.load(req.user._id)
                .then(function(user) {
                        if (!user) return next(new Error('not found'));
                        req.user = user;
                        next();
                    },
                    function(err) {
                        next(err || "Error loading the user " + req.user._id);
                    });
        } else next();
    });

    // user routes
    app.get('/login', function(req, res) {
        res.locals.recaptcha_form = recaptcha.toHTML();
        return users.login(req, res);
    });
    app.get('/logout', users.logout);
    app.post('/users', function(req, res) {
        var data = {
            remoteip: req.connection.remoteAddress,
            challenge: req.body.recaptcha_challenge_field,
            response: req.body.recaptcha_response_field
        };

        recaptcha.verify(data, function(err) {
            if (err) {

                req.flash('error', res.__(err.message));
                res.redirect('/login');
            } else {
                return users.create(req, res);
            }
        });
    });
    app.post('/users/session',
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: i18n.__('Invalid email or password, please try again.')
        }), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }), users.authCallback);
    app.post('/auth/facebook/canvas',
        passport.authenticate('facebook-canvas', {
            scope: ['email', 'user_about_me'],
            successRedirect: '/',
            failureRedirect: '/auth/facebook/canvas/autologin'
        }), users.signin);
    app.get('/auth/facebook/canvas',
        passport.authenticate('facebook-canvas', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/auth/facebook/canvas/autologin'
        }), users.signin);
    app.get('/auth/facebook/canvas/autologin', function(req, res) {
        res.send('<!DOCTYPE html>' +
            '<body>' +
            '<script type="text/javascript">' +
            'top.location.href = "/auth/facebook/canvas";' +
            '</script>' +
            '</body>' +
            '</html>');
    });
    app.get('/auth/twitter',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.signin);
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }), users.authCallback);
    app.get('/auth/google',
        passport.authenticate('google', {
            failureRedirect: '/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }), users.authCallback);


    //params
    app.param('userId', users.user);
    app.param('groupid', groups.load);
    app.param('expid', expenses.load);
    app.param('shopid', shoppings.load);

    /**
     * Group routes
     **/
    app.get('/groups/new/:isModal', auth.requiresLogin, groups.new);
    app.post('/groups/', auth.requiresLogin, groups.create);
    app.get('/groups/:groupid/:isModal', groupAuth, groups.edit);
    app.post('/groups/:groupid/select', auth.requiresLogin, groups.select);
    app.delete('/groups/:groupid/removeUser', auth.requiresLogin, groups.removeUser);
    app.get('/groups/:groupid', isReady, groups.show);
    app.put('/groups/:groupid', groupAuth, groups.update);
    app.delete('/groups/:groupid', groupAuth, groups.destroy);

    // expense routes
    app.get('/expense', isReady, expenses.get);
    app.put('/expense', isReady, expenses.new);
    app.post('/expense/:expid/updateItem', isReady, expenses.updateItem);
    app.post('/expense/:expid/removeItem', isReady, expenses.removeItem);


    // shopping routes
    app.get('/shopping', isReady, shoppings.get); //get current shopping object
    app.put('/shopping', isReady, shoppings.new);
    app.post('/shopping/:shopid/updateItem', isReady, shoppings.updateItem);
    app.post('/shopping/:shopid/removeItem', isReady, shoppings.removeItem);


    //invit routes
    app.post('/invite/send', isReady, invites.send);
    app.get('/invite/valid', auth.requiresLogin, invites.valid);
    app.post('/invite/valid', auth.requiresLogin, invites.valid);

    app.get('/', auth.requiresLogin, users.sendBootstrapLayout);

};
