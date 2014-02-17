/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Expense = mongoose.model('Expense')
  , utils = require('../lib/utils')
  , extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Expense.load(id, function (err, expense) {
    if (err) return next(err)
    if (!expense) return next(new Error('not found'))
    req.expense = expense
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){

  Expense.current(req.group,function(err, expense) {
    if (err) return res.render('500')

    var cb = function(err) {
      Expense.archiveList(req.group,function (err, archives) {
        if (err) return res.render('500')
        res.render('expenses/index', {
          expense: expense,
          archives: archives
        })
      })
    }

    if (!expense) {
      expense = new Expense({
        group: req.group,
        users : [ {
          user: req.user,
          items : []
        }]
      })
      expense.save(cb)
    }
    else cb()
  })

}

/**
 * New expense
 */

exports.new = function(req, res){

    Expense.current(req.group,function(err, cexpense) {
      if (err) return res.render('500')

      //archive current list
      cexpense.archivedAt = new Date;
      cexpense.save(function(err) {
        if (err) return res.render('500')
          // create new list
          var expense = new Expense({
           group: req.group,
           users : [ {
            user: req.user,
            items : []
           }]
          })
          expense.save(function(err) {
            if (err) res.render('500');
            res.redirect('/expenses');
          })
      })
    })
}

/**
 * Show
 */

exports.show = function(req, res){
  if (req.expense) {
    Expense.archiveList(req.group,function (err, archives) {
        if (err) return res.render('500')
        res.render('expenses/index', {
          expense: expense,
          archives: archives
        })
      })
  }
  else {
    res.redirect('/expenses')
  }

  
}

