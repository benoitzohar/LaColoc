
/*global angular,io,console,ExpenseCtrl,ShoppingCtrl,$ */
/*jshint unused:false */

// Globally available vars
var app = {},
    lca = null,
    socket = null,
    current_user = null;

// General functions
var log = function(a,b,c,d,e,f) {
    if (console && console.log) {
        if (f) console.log(a,b,c,d,e,f);
        else if (e) console.log(a,b,c,d,e);
        else if (d) console.log(a,b,c,d);
        else if (c) console.log(a,b,c);
        else if (b) console.log(a,b);
        else if (a) console.log(a);
    }
};
    

/**
 * The main lacoloc angular app module
 *
 * @type {angular.Module}
 */
lca = angular.module('lacoloc', ['ngRoute','ui.bootstrap','oitozero.ngSweetAlert'])
    .config(['$routeProvider', function($routeProvider,$routeParams) {
        $routeProvider
          .when('/expenses', { templateUrl: '/expenses', controller: 'ExpenseCtrl' })
          .when('/shopping', { templateUrl: '/shopping', controller: 'ShoppingCtrl' })
          .when('/groups/new', { templateUrl: '/groups/new' })
          .when('/groups/:groupid', { templateUrl: function(args) { return '/groups/'+args.groupid; }})
          .otherwise({ redirectTo: '/expenses' });
      }]);

app = {

    config : {},

    init: function(url,user,config,cb) {
        log("app.init(",url,'user',user,');');
        this.config = config;
        //hide loggin button in facebook frame
        if (window!=window.top) {
            $('.menu-user-infos').remove();
        }
        current_user = user;
        this.initSocket(url);
        this.initPage();

        if (cb) cb();
    },

    initPage: function() {
/*        $('.datepicker').datepicker({
            format : app.config.date_format || 'mm/dd/yyyy',
            weekStart : 1,
            language: app.config.locale || 'en'
        });
        $('.datepicker.current_date').datepicker("setDate",new Date());
        */
    },

    initSocket : function(url) {
        socket = io(url,{
            'reconnection delay' : 200
        });
    },

    sendInvitation: function() {
        $('#inviteemail').parents('form').submit();
    },

    loader : null,
    showLoader: function(timeout, time) {
        //save loader start time to avoid duplication if the result came early
        var current_time = +new Date();

        //check if the time passed is equal to known time
        if (time) {
            if (time !== this.loader) {
                //don't do anything if the timestamp is not the same
                return false;
            }
        }

        this.loader = current_time;
        //start after a certain time if necessary
        if (timeout) {
            setTimeout(function() {
                app.showLoader(null,current_time);
            },timeout*1000);
            return;
        }
        $('#loader').fadeIn(400);
    },

    hideLoader: function() {
        this.loader = null;
        $('#loader').fadeOut(400);
    }
 
};
