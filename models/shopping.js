
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , config = require('../config/config')
  , Schema = mongoose.Schema
  , utils = require('../lib/utils')


/**
 * Shopping Schema
 */

var ShoppingSchema = new Schema({
  group: { type : Schema.ObjectId, ref : 'Group' },
  items: [{
    title: { type : String, default : '' },
    //author: { type : Schema.ObjectId, ref : 'User' },
    completed : Boolean,
    createdAt: { type : Date, default : Date.now }
  }],
  createdAt  : {type : Date, default : Date.now},
  archivedAt : {type : Date }
})


/**
 * Methods
 */

ShoppingSchema.methods = {

  /**
   * Add item
   *
   * @param {String} title
   * @param {Function} cb
   * @api private
   */

  addItem: function (title, cb) {
    
    this.items.push({
      title: title
    })

    this.save(cb)
  },

  /**
   * Remove item
   *
   * @param {itemId} String
   * @param {Function} cb
   * @api private
   */

  removeItem: function (itemId, cb) {
    var index = utils.indexof(this.items, { id: commentId })
    if (~index) this.items.splice(index, 1)
    else return cb('not found')
    this.save(cb)
  },

  /**
   * check item
   *
   * @param {itemId} String
   * @param {Function} cb
   * @api private
   */

  checkItem: function (itemId, cb) {
    var index = utils.indexof(this.items, { id: itemId })
    if (~index) this.comments[index].checked = true;
    else return cb('not found')
    this.save(cb)
  },

  /**
   * unCheck item
   *
   * @param {itemId} String
   * @param {Function} cb
   * @api private
   */

  unCheckItem: function (itemId, cb) {
    var index = utils.indexof(this.items, { id: itemId })
    if (~index) this.comments[index].checked = false;
    else return cb('not found')
    this.save(cb)
  }

}

/**
 * Statics
 */

ShoppingSchema.statics = {

  /**
   * Find shopping by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('group')
      .exec(cb)
  },

  /**
   * Current shopping
   *
   * @param {groupId} String
   * @param {Function} cb
   * @api private
   */

  current: function (group,cb) {
    this.findOne({group:group, archivedAt: null})
      .populate('group')
      .exec(cb)
  },

  /**
   * List shopping archives
   *
   * @param {groupId} String
   * @param {Function} cb
   * @api private
   */

  archiveList: function (groupId, cb) {
    this.find({group:groupId, archivedAt: {'$ne': null }}) 
      .populate('group')
      .sort({'createdAt': -1}) // sort by date
      .exec(cb)
  }

}

mongoose.model('Shopping', ShoppingSchema)
