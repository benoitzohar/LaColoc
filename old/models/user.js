/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    oAuthTypes = ['twitter', 'facebook', 'google'],
    q = require('promised-io/promise'),
    utils = require('../lib/utils');

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' },
  picture : { type: String, default:'' },
  facebook: {},
  twitter: {},
  google: {},
  groups: [{
    group      : {type : Schema.ObjectId, ref : 'Group' },
    rights     : {type : Number, default: 0 },
    createdAt  : {type : Date, default : Date.now}
  }],
  current_group: {type : Schema.ObjectId, ref : 'Group' },
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() { return this._password; });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  if (this.doesNotRequireValidation()) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (this.doesNotRequireValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User');
  if (this.doesNotRequireValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('username').validate(function (username) {
  if (this.doesNotRequireValidation()) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.doesNotRequireValidation()) return true;
  return hashed_password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.doesNotRequireValidation())
    next(new Error('Invalid password'));
  else
    next();
});

/**
 * Methods
 */

UserSchema.methods = {

  /**
   *  Provide a user object that is safe to send to client
   */
  getSafeObject: function() {
      return {
        _id: this._id,
        name: this.name,
        email: this.email,
        username: this.username,
        provider: this.provider,
        picture : this.picture,
        groups: this.groups,
        current_group: this.current_group,
        createdAt: this.createdAt
      };
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return '';
    var encrypred;
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex');
      return encrypred;
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

  doesNotRequireValidation: function() {
    return ~oAuthTypes.indexOf(this.provider);
  },

  /**
   * Add group
   *
   * @param {Group} group
   * @param {Number} rights
   * @param {Function} cb
   * @api private
   */

  addGroup: function (group, rights, cb) {

    var d = new q.Deferred();

    this.groups.push({
      group: group._id,
      rights: rights
    });

    var user = this;

    this.save(function(err) {
      if (err) return d.reject(err);
      //add user to group (for cross references)
      group.addUser(user)
        .then(function(group) {
          return d.resolve(group);
        });
    });

    return d.promise;
  },

  /**
   * Remove group
   *
   * @param {groupId} String
   * @api private
   */

  removeGroup: function (groupId) {

    var d = new q.Deferred();

    var user = this;
    var index = this.getGroupIndex(groupId);
    var Group = mongoose.model('Group');
    var actions = [];
    
    //if group was found locally
    if (~index) {
        this.groups.splice(index, 1);
        //add save action first
        actions.push(this.save());
       
    }
    //otherwise, the actions are empty
    //we're using "all()" to perform conditionnal action this

    q.all(actions)
      .then(function(){
        //load group from ID
        return Group.load(groupId);
      })
      .then(function(group){
        //remove user from group as well
        return group.removeUser(user._id);
      })
      .then(function(){
        //send the user back to the caller
        d.resolve(user); 
      },
      function(err){
        d.reject("Could not load group:"+groupId+": "+err);
      });

    return d.promise;
  },

  /**
   * hasGroup
   *
   * @api private
   */

  hasGroup: function() {
    return this.groups.length > 0;
  },


  /**
   * isInGroup
   *
   * @param {groupsId} String
   * @api private
   */

  isInGroup: function(groupId) {
    return this.getGroupIndex(groupId) > -1;
  },

  getGroupIndex: function(groupId) {
     for (var i=0;i<this.groups.length;i++) {
      if (this.groups[i] && this.groups[i].group && this.groups[i].group._id && this.groups[i].group._id == groupId+'') {
        return i;
      }
      else if (this.groups[i] && this.groups[i].group && this.groups[i].group == groupId+''){
        return i;
      }
    }
    return -1;
  },

   /**
   * getGroups
   *
   * @api private
   */

  getGroups: function() {
    return this.groups;
  },

  /**
   * selectGroup
   *
   * @param {Group} group
   * @api private
   */

  selectGroup: function (group) {
    this.current_group = group._id;
    return this.save();
  },
};


/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (id) {
    return this.findOne({ _id : id })
      .populate('current_group')
      .populate('groups.group')
      .exec();
  }

};

mongoose.model('User', UserSchema);
