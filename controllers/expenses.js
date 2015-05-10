/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Expense = mongoose.model('Expense'),
    utils = require('../lib/utils'),
    extend = require('util')._extend,
    q = require('promised-io/promise'),
    socket = null;

//init the controller with the Socket.IO instance
exports.initController = function(sock) {
  socket = sock;
};

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Expense.load(id)
  .then(function (expense) {
    if (!expense) return next(new Error('not found'));
    req.expense = expense;
    next();
  },
  function(err) {
      return next(err || "Error while loading the expense "+id);
  });
};

/**
 * List
 */

exports.index = function(req, res){

  Expense.current(req.group)
  .then(function(expense) {

    var cb = function(err) {
      res.render('expenses', {
        expense: expense
      });
    };

    if (!expense) {
      expense = new Expense({
        group: req.group,
        users : [ {
          user: req.user,
          items : []
        }]
      });
      expense.save(cb);
    }
    else {
      cb();
    }
  },
  function(err) { return res.render('500'); });
};

/**
 * New expense
 */

exports.new = function(req, res){

    Expense.current(req.group)
    .then(function(cexpense) {

      //archive current list
      cexpense.archivedAt = new Date();
      cexpense.save(function(err) {
        if (err) return res.render('500');
          // create new list
          var expense = new Expense({
           group: req.group,
           users: [{
            user: req.user,
            items : []
           }]
          })
          expense.save(function(err) {
            if (err) res.render('500');
            res.redirect('/#/expenses');
          })
      })
    },
    function(err) { return res.render('500'); });
}

/**
 * Show
 */

exports.show = function(req, res){
  if (req.expense) {
    Expense.archiveList(req.group)
    .then(function (archives) {
      res.render('expenses', {
        expense: expense,
        archives: archives
      });
    }, 
    function(err) { return res.render('500'); });
  }
  else {
    res.redirect('/expenses');
  }
}

