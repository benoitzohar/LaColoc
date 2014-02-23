
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  //, Imager = require('imager')
  , config = require('../config/config')
  //, imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema
  , utils = require('../lib/utils')


/**
 * Expense Schema
 */

var ExpenseSchema = new Schema({
  group: { type : Schema.ObjectId, ref : 'Group' },
  users: [{
    user:{type : Schema.ObjectId, ref : 'User' },
    items: [{
      title: { type : String, default : '' },
      value : {type: Number, default: 0},
      date : { type : Date, default : Date.now },
      createdAt: { type : Date, default : Date.now }
    }],
    total: {type: Number, default: 0},
    diff: {type: Number, default: 0}
  }],
  total: Number,
  createdAt  : {type : Date, default : Date.now},
  archivedAt : {type : Date }
})

/**
 * Pre-save hook
 */

ExpenseSchema.pre('save', function (next) {
  
  //calculate all totals and shit

  var grand_total = 0

  for(var i=0;i<this.users.length;i++) {
    var u = this.users[i]
      , total = 0

    for(var j=0;j<u.items.length;j++) {
      total += u.items[j].value || 0
    }

    this.users[i].total = total;
    grand_total += total;
  }

  for(var i=0;i<this.users.length;i++) {
    this.users[i].diff = parseInt((this.users[i].total - (grand_total / this.users.length)) * 100,10)/ 100;
  }

  this.total = Math.round(grand_total*100)/100;

  next()
})

/**
 * Methods
 */

ExpenseSchema.methods = {

  /**
   * Add item
   *
   * @param {User} user
   * @param {Function} cb
   * @api private
   */

  addItem: function (user, item, cb) {
    
    var index = this.getUserIndex(user._id);
    if (!~index) {
      this.users.push({
        user: user,
        items : []
      })
      index = this.users.length-1;
    }
    
    this.users[index].items.push(item)
    if (cb) this.save(cb)
  },

  updateItem: function(user,item,cb) {
    var indexUser = this.getUserIndex(user._id);
    if (~indexUser) {
      var indexItem = this.getItemIndexForUserId(user._id,item._id);
      if (~indexItem) {
        this.users[indexUser].items[indexItem].title = item.title;
        this.users[indexUser].items[indexItem].value = item.value;
        this.users[indexUser].items[indexItem].date = item.date;
        if (cb) this.save(cb)
      }
    }

  },
  removeItem: function(user,itemId,cb) {
    var indexUser = this.getUserIndex(user._id);
    if (~indexUser) {
      var indexItem = this.getItemIndexForUserId(user._id,itemId);
      if (~indexItem) {
        this.users[indexUser].items.splice(indexItem,1);
        if (cb) this.save(cb)
      }
    }
  },

  getUserIndex: function(userId) {
     for (var i=0;i<this.users.length;i++) {
      if (this.users[i] && this.users[i].user && this.users[i].user._id == userId+'') {
        return i;
      }
    }
    return -1;
  },

  getItemIndexForUserId: function(userId, itemId) {
    var index = this.getUserIndex(userId);
    if (!~index) return -1;
    for (var i=0;i<this.users[index].items.length;i++) {
      if (this.users[index].items[i] && this.users[index].items[i]._id == itemId+'') {
        return i;
      }
    }
    return -1;
  }

}

/**
 * Statics
 */

ExpenseSchema.statics = {

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
      .populate('users.user')
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
      .populate('users.user')
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
      .populate('users.user')
      .sort({'createdAt': -1}) // sort by date
      .exec(cb)
  }

}

mongoose.model('Expense', ExpenseSchema)
