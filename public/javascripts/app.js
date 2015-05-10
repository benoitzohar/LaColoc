
/*global angular,io,console,ExpenseCtrl,ShoppingCtrl,$ */
/*jshint unused:false */

// Globally available vars
var app = {},
    lca = null,
    socket = null,
    user = null;

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
lca = angular.module('lacoloc', ['ngRoute','ngCookies','ui.bootstrap','oitozero.ngSweetAlert'])
    //configure CSRF middleware
    .provider('csurf',[function(){
      var headerName = 'x-csrf-token';
      var cookieName = '_csrf';
      var allowedMethods = ['GET'];

      this.setHeaderName = function(n) { headerName = n; };
      this.setCookieName = function(n) { cookieName = n; };
      this.setAllowedMethods = function(n) { allowedMethods = n; };
      this.$get = ['$cookies', function($cookies){
        return {
          'request': function(config) {
            if(allowedMethods.indexOf(config.method) === -1) {
              // do something on success
              config.headers[headerName] = $cookies[cookieName];
            }
            return config;
          }
        };
      }];
    }]).config(function($httpProvider) {
      $httpProvider.interceptors.push('csurf');
    })

    //Routing
    .config(['$routeProvider', function($routeProvider,$routeParams) {
        $routeProvider
          .when('/expenses', { 
            templateUrl: 'expensesTemplate.html', 
            controller: 'ExpenseCtrl' 
          })
          .when('/shopping', { 
            templateUrl: 'shoppingTemplate.html', 
            controller: 'ShoppingCtrl' 
          })
          .when('/groups/new/:isModal', { 
            templateUrl: function(args) { return '/groups/new/'+args.isModal; },
            controller: 'GroupCtrl' 
           })
          .when('/groups/:groupid', { 
            templateUrl: function(args) { return '/groups/'+args.groupid; },
            controller: 'GroupCtrl' 
          });
      }]);

app = {

    config : {},

    init: function(url,current_user,config,cb) {
        this.config = config;
        //hide loggin button in facebook frame
        if (window!=window.top) {
            $('.menu-user-infos').remove();
        }
        user = current_user;
        
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
