
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Notifier = require('notifier')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]

/**
 * Notification methods
 */

var Notify = {

  /**
   * Invite notification
   *
   * @param {Object} options
   * @param {Function} cb
   * @api public
   */

  invite: function (options, cb) {
    var notifier = new Notifier(config.notifier)
      , user = options.currentUser

    var obj = {
      to: options.to_email,
      from: config.email,
      subject: user.name + ' invited you to join his coloc',
      alert: user.name + ' says: "',
      locals: {
        to: options.to_email,
        from: user.name,
        link: config.url+'invite/valid?code='+options.code,
        code: options.code
      }
    }

    // for apple push notifications
    /*notifier.use({
      APN: true
      parseChannels: ['USER_' + author._id.toString()]
    })*/

    notifier.send('invite', obj, cb)
  }
}

/**
 * Expose
 */

module.exports = Notify
