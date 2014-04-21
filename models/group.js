/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , utils = require('../lib/utils')

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
})


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 5 validations only apply if you are signing up traditionally

GroupSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')


GroupSchema.path('name').validate(function (name, fn) {
  var Group = mongoose.model('Group')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('name')) {
    Group.find({ name: name }).exec(function (err, groups) {
      fn(!err && groups.length === 0)
    })
  } else fn(true)
}, 'Group already exists')

/**
 * Pre-save hook
 */

GroupSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.name))
    next(new Error('Invalid name'))
  else
    next()
})

/**
 * Methods
 */

GroupSchema.methods = {

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    /*if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }*/
  },

  /**
   * Add user to group
   *
   * @param {User Object} user
   * @param {Function} cb
   * @api public
   */

  addUser: function(user,cb) {
    this.users.push(user);
    this.save(cb);
  },

  removeUser: function(userId,cb) {
    var index = this.getUserIndex(userId)
    console.log('index:',index,' userId:',userId,' this.users:',this.users)
    if (~index) {
      this.users.splice(index, 1)
    }
    this.save(cb)
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

},

/**
 * Statics
 */

GroupSchema.statics = {

  /**
   * Find group by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('users')
      .exec(cb)
  }

}

mongoose.model('Group', GroupSchema)
