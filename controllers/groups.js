/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    utils = require('../lib/utils'),
    extend = require('util')._extend;

/**
 * Load
 */

exports.load = function(req, res, next, id){

  Group.load(id)
    .then(function(group) {
      if (!group) return next(new Error('not found'));
      req.group = group;

      next();
    },
    function(err){
      return next(err || "Error loading the group "+id);
    });
};

/**
 * New group
 */

//GET
exports.new = function(req, res) {
  res.render('groups/new', {
    group: new Group({}),
    isModal: req.params.isModal,
    action: "/groups"
  });
};

/**
 * Create a group
 */

//PUT
exports.create = function (req, res) {
  var group = new Group(req.body);

  group.save()
    .then(function(group){
      //add current user  (as admin)
      return req.user.addGroup(group,1);
    })
    .then(function(group){
      //add current user  (as admin)
      return req.user.selectGroup(group);
    })
    .then(function(){
       //get safe user object
        return User.load(req.user._id);
    })
    .then(function(user) {
        var safe_user = user.getSafeObject();
        return utils.sendJSON(res,null,{user: safe_user});
    },
    function(err) {
      return utils.sendJSON(res,utils.errors(err.errors || err));
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


