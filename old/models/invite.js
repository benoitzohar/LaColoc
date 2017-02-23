/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    q = require('promised-io/promise'),
    Schema = mongoose.Schema;

/**
 * Invite Schema
 */

var InviteSchema = new Schema({
  code: { type: String, default: '' },
  email: { type: String, default: '' },
  group: {type : Schema.ObjectId, ref : 'Group' },
  createdAt  : {type : Date, default : Date.now},
  usedAt  : {type : Date}
});


/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */

InviteSchema.pre('save', function(next) {
  if (!this.isNew) return next();

  if (!validatePresenceOf(this.code))
    next(new Error('Invalid code'));
  else
    next();
});

/**
 * Methods
 */

InviteSchema.methods = {

  /**
   * use the code
   *
   * @param user : current user
   * @api public
   */

  use: function (user) {

    var d = new q.Deferred();

    if (this.usedAt) {
      d.reject("Code already used");
    }
    else {
      this.usedAt = new Date();
      this.save()
        .then(function(invite) {
          //load group from invite
          var Group = mongoose.model('Group');
          return Group.load(invite.group);
        })
        .then(function(group){
          return user.addGroup(group,0);
        })
        .then(function(group) {
            return user.selectGroup(group);
        })
        .then(function() {
          d.resolve();
        }, 
        function(err){
          d.reject("Error while using an invite code :"+err);
        });
    }

    return d.promise;

  }

};

mongoose.model('Invite', InviteSchema);
