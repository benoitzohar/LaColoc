/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Shopping = mongoose.model('Shopping')
  , utils = require('../lib/utils')
  , extend = require('util')._extend

/**
 * Load
 */

exports.load = function(req, res, next, id){
  
  Shopping.load(id, function (err, shopping) {
    if (err) return next(err)
    if (!shopping) return next(new Error('not found'))
    req.shopping = shopping
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){

  Shopping.current(req.group,function(err, shopping) {
    if (err) return res.render('500')

    var cb = function(err) {
      Shopping.archiveList(req.group,function (err, archives) {
        if (err) return res.render('500')
        res.render('shoppings/index', {
          shopping: shopping,
          archives: archives
        })
      })
    }

    if (!shopping) {
      shopping = new Shopping({
        group: req.group
      })
      shopping.save(cb)
    }
    else cb()
  })

}

/**
 * New shopping
 */

exports.new = function(req, res){

    Shopping.current(req.group,function(err, cshopping) {
      if (err) return res.render('500')

      //archive current list
      cshopping.archivedAt = new Date;
      cshopping.save(function(err) {
        if (err) return res.render('500')
          // create new list
          var shopping = new Shopping({
            group: req.group
          })
          shopping.save(function(err) {
            if (err) res.render('500');
            res.redirect('/shopping');
          })
      })
    })
}

/**
 * Show
 */

exports.show = function(req, res){
  if (req.shopping) {
    Shopping.archiveList(req.group,function (err, archives) {
        if (err) return res.render('500')
        res.render('shoppings/index', {
          shopping: shopping,
          archives: archives
        })
      })
  }
  else {
    res.redirect('/shopping')
  }

  
}

