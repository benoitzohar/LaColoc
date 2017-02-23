/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    q = require('promised-io/promise'),
    utils = require('../lib/utils');

/**
 * Group Schema
 */

var GroupSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  devise: { type: String, default: '€' },
  users: [{type : Schema.ObjectId, ref : 'User' }],
  createdAt  : {type : Date, default : Date.now},
  updatedAt  : {type : Date, default : Date.now}
});


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

GroupSchema.path('name').validate(function (name) {
  return name.length;
}, 'Name cannot be blank');


GroupSchema.path('name').validate(function (name, fn) {
  var Group = mongoose.model('Group');

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('name')) {
    Group.find({ name: name }).exec(function (err, groups) {
      fn(!err && groups.length === 0);
    });
  } else fn(true);
}, 'Group already exists');

/**
 * Pre-save hook
 */

GroupSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.name))
    next(new Error('Invalid name'));
  else
    next();
});

/**
 * Methods
 */

GroupSchema.methods = {

  /**
   * Add user to group
   *
   * @param {User Object} user
   * @api public
   */
  addUser: function(user) {
    this.users.push(user);
    return this.save();
  },

  /**
   * Remove user from group
   *
   * @param {User Object} user
   * @api public
   */
  removeUser: function(userId) {
    var index = this.getUserIndex(userId);
    if (~index) {
      this.users.splice(index, 1);
    }
    return this.save();
  },

  getUserIndex: function(userId) {
     for (var i=0;i<this.users.length;i++) {
      if (this.users[i] && this.users[i]._id && this.users[i]._id == userId+'') {
        return i;
      }
    }
    return -1;
  },

  hasUser: function(userId) {
    return this.getUserIndex(userId) !== -1;
  }

};

/**
 * Statics
 */

GroupSchema.statics = {

  /**
   * Find group by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (id) {
    return this.findOne({ _id : id })
      .populate('users')
      .exec();
  }

};

mongoose.model('Group', GroupSchema);
