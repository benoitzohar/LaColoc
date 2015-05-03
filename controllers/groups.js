/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    utils = require('../lib/utils'),
    extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var Group = mongoose.model('Group');

  Group.load(id, function (err, group) {
    if (err) return next(err);
    if (!group) return next(new Error('not found'));
    req.group = group;

    next();
  });
};

/**
 * List
 */

exports.index = function(req, res){
  /*var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Group.list(options, function(err, groups) {
    if (err) return res.render('500')
    group.count().exec(function (err, count) {
      res.render('groups/index', {
        title: 'groups',
        groups: groups,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
    })
  })*/
  res.redirect('/');
};

/**
 * New group
 */

exports.new = function(req, res){
  res.render('groups/new', {
    title: 'New group',
    group: new Group({})
  });
};

/**
 * Create a group
 */

exports.create = function (req, res) {
  var group = new Group(req.body);

  group.save(function(err) {
    if (err) {
      res.render('groups/new', {
        group: group,
        error: utils.errors(err.errors || err)
      });
    } 

    //add current user  (as admin)
    req.user.addGroup(group,1,function(err) {
      if (err) {
        console.log('addGrouperr',err);
        //TODO qqchose pour eviter que le groupe ne soit créé sans user
      }

      //select group as current for user
      req.user.selectGroup(group,function(err) {
        if (err) res.redirect('/');
        res.redirect('/groups/'+group._id);
      });
      
    });
   
    
  });
};

/**
 * Edit an group
 */

exports.edit = function (req, res) {
  res.render('groups/edit', {
    title: 'Edit ' + req.group.name,
    group: req.group
  });
};


/**
 * Select group
 */

exports.select = function(req, res){
  if (!req.user.isInGroup(req.group.id)) return res.render('500');
  req.user.selectGroup(req.group,function(err) {
    if (err) req.flash('error', 'Could not select');
    res.redirect('/');
  });
};

/**
 * Update group
 */

exports.update = function(req, res){
  var group = req.group;
  group = extend(group, req.body);

  group.save(function(err) {
    if (!err) {
      return res.redirect('/groups/' + group._id);
    }

    res.render('groups/edit', {
      title: 'Edit group',
      group: group,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function(req, res){

  res.render('groups/show', {
    title: req.group.name,
    group: req.group,
    current_user_id: req.user._id
  });
};

/**
 * Delete an group
 */

exports.destroy = function(req, res){
  var group = req.group;
  group.remove(function(err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/groups');
  });
};

/**
 * Remove user from group
 */

exports.removeUser = function(req, res){
  var group = req.group,
     userid = req.query.user_to_remove,
     User = mongoose.model('User');

  //make sure the current user is admin
  //@TODO
  User.load(userid,function(err,user){
    if (err) return res.render('500',{error:'Could not find the user:'+userid});
      
    user.removeGroup(group._id,function(err){
      if (err) return res.render('500',{error:'Could not remove user from group err='+err});
      user.current_group = undefined;
      user.save(function() {
        res.redirect('/groups/'+group._id);
      });
    });
  });
};


