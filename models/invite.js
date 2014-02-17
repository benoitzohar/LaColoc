/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema

/**
 * Invite Schema
 */

var InviteSchema = new Schema({
  code: { type: String, default: '' },
  email: { type: String, default: '' },
  group: {type : Schema.ObjectId, ref : 'Group' },
  createdAt  : {type : Date, default : Date.now},
  usedAt  : {type : Date}
})


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

/**
 * Pre-save hook
 */

InviteSchema.pre('save', function(next) {
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.code))
    next(new Error('Invalid code'))
  else
    next()
})

/**
 * Methods
 */

InviteSchema.methods = {

  /**
   * use the code
   *
   * @param user : current user
   * @param {Function} cb
   * @api public
   */

  use: function (user,cb) {
    if (this.usedAt) return cb("Code already used")
    this.usedAt = new Date;
    this.save(function(err,invite) {
      if (err |!invite) res.render('500')
      var Group = mongoose.model('Group')

      Group.load(invite.group,function(err,group){
        if (err) res.render('500')
        user.addGroup(group,0,function(err){
          if (err) res.render('500')
          user.selectGroup(group,cb)
        })
      })

    });


  }

}

mongoose.model('Invite', InviteSchema)
