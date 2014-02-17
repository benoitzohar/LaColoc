/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , crypto = require('crypto')
  , oAuthTypes = ['twitter', 'facebook', 'google']
  , utils = require('../lib/utils')

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
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  if (this.doesNotRequireValidation()) return true
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  if (this.doesNotRequireValidation()) return true
  return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')
  if (this.doesNotRequireValidation()) fn(true)

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('username').validate(function (username) {
  if (this.doesNotRequireValidation()) return true
  return username.length
}, 'Username cannot be blank')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.doesNotRequireValidation()) return true
  return hashed_password.length
}, 'Password cannot be blank')


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password)
    && !this.doesNotRequireValidation())
    next(new Error('Invalid password'))
  else
    next()
})

/**
 * Methods
 */

UserSchema.methods = {

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
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

    this.groups.push({
      group: group._id,
      rights: rights
    })

    var user = this;

    this.save(function(err) {
      if (err) return cb(err);
      //add user to group (for cross references)
      group.addUser(user,cb);
    });
  },

  /**
   * Remove group
   *
   * @param {groupId} String
   * @param {Function} cb
   * @api private
   */

  removeGroup: function (groupId, cb) {
    var user = this;
    var index = this.getGroupIndex(groupId);
    var Group = mongoose.model('Group')
    
    if (~index) {
        this.groups.splice(index, 1)
        this.save(function(err) {
          
          Group.load(groupId,function(err,group){
            if (err) return res.render('500',{error:'Could not load group:'+groupId})
            group.removeUser(user._id,cb)
          })
        })
    }
    else {
      Group.load(groupId,function(err,group){
          if (err) return res.render('500',{error:'Could not load group:'+groupId})
          group.removeUser(user._id,cb)
        })
    }
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
    console.log('this.getGroupIndex(groupId)',this.getGroupIndex(groupId),"this.groups",this.groups)
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
   * @param {Function} cb
   * @api private
   */

  selectGroup: function (group, cb) {
    this.current_group = group._id;
    this.save(cb)
  },
},


/**
 * Statics
 */

UserSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('current_group')
      .populate('groups.group')
      .exec(cb)
  }

}

mongoose.model('User', UserSchema)
