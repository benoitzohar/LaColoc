
/*global angular */
/*jshint unused:false */
'use strict';

var log = function(a,b,c,d,e,f) {
    if (console && console.log) {
        if (f) console.log(a,b,c,d,e,f)
        else if (e) console.log(a,b,c,d,e)
        else if (d) console.log(a,b,c,d)
        else if (c) console.log(a,b,c)
        else if (b) console.log(a,b)
        else if (a) console.log(a)
    }
}

var socket = null;
var current_user = null;

/**
 * The main lacoloc angular app module
 *
 * @type {angular.Module}
 */
var lcangular = angular.module('lcangular', []);


var app = {

    current_shopping_id : null,
    current_expense_id : null,

    init: function(url,user,cb) {
        log("app.init(",url,'user',user,');');

        //hide loggin button in facebook frame
        if (window!=window.top) {
            $('.menu-user-infos').remove();
        }

        current_user = user;
        this.initSocket(url);
        if (cb) cb();
    },

    initSocket : function(url) {
        socket = io.connect(url,{
            'reconnection delay' : 1000
        });
        //this.initShoppingEvents();
        socket.on('shopping:list',function(data) {
            console.log('shopping:list data',data);
        });
    },

    initShopping: function(id) {
        if (!id) return false;
        this.current_shopping_id = id;
        socket.emit('shopping:get', {shopping_id: id});  
    },

    initExpense: function(id) {
        if (!id) return false;
        this.current_expense_id = id;
        socket.emit('expense:get', {expense_id: id});  
    },

    /*initShoppingEvents: function() {
        socket.on('shopping:get',function(data) {
            console.log('shopping:get=',data);
        }); 

         socket.on('shopping:',function(data) {
            console.log('shopping.items.response=',data);
        });

    }*/

    sendInvitation: function() {
        $('#inviteemail').parents('form').submit();
    }
 
}
