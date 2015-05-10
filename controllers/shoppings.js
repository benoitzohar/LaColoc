/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Shopping = mongoose.model('Shopping'),
    utils = require('../lib/utils'),
    extend = require('util')._extend,
    q = require('promised-io/promise');

/**
 * Load
 */

exports.load = function(req, res, next, id){
  
  Shopping.load(id)
    .then(function(shopping) {
      if (!shopping) return next(new Error('not found'));
      req.shopping = shopping;
      next();
    },
    function(err){
      return next(err || "Error loading the shopping "+id);
    });
};

/**
 * List
 */

exports.index = function(req, res){

  Shopping.current(req.group)
  .then(function(shopping) {

    var cb = function(err) {
      res.render('shoppings', {
          shopping: shopping
      })
    }

    if (!shopping) {
      shopping = new Shopping({
        group: req.group
      })
      shopping.save(cb)
    }
    else cb()
  }, function() {
    return res.render('500')
  });

}

/**
 * New shopping
 */

exports.new = function(req, res){

    Shopping.current(req.group)
    .then(function(cshopping) {

      //if there are no items in the old group
      if (cshopping.items.length === 0) {
        //do not archive
        return res.send("0");
      }

      //archive current list
      cshopping.archivedAt = new Date();
      cshopping.save(function(err) {
        if (err) return res.render('500');
          // create new list
          var shopping = new Shopping({
            group: req.group
          });
          shopping.save(function(err) {
            if (err) res.render('500');
            res.send("1");
          });
      });
    }, 
    function(err) { 
      return res.render('500'); 
    });
};

/**
 * Show
 */

exports.show = function(req, res){
  if (req.shopping) {
    Shopping.archiveList(req.group)
    .then(function (archives) {
      res.render('shoppings', {
        shopping: shopping,
        archives: archives
      })
    })
  }
  else {
    res.redirect('/shopping')
  }

  
};

