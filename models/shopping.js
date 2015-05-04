
/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
  //, Imager = require('imager')
    config = require('../config/config'),
    Schema = mongoose.Schema,
    utils = require('../lib/utils'),
    q = require('promised-io/promise');


/**
 * Shopping Schema
 */

var ShoppingSchema = new Schema({
  group: { type : Schema.ObjectId, ref : 'Group' },
  items: [{
    title: { type : String, default : '' },
    author: { type : Schema.ObjectId, ref : 'User' },
    completed : Boolean,
    createdAt: { type : Date, default : Date.now },
    updatedAt: { type : Date, default : Date.now },
    deletedAt: { type : Date }
  }],
  createdAt  : {type : Date, default : Date.now},
  archivedAt : {type : Date }
});


/**
 * Methods
 */

ShoppingSchema.methods = {

   /**
   * Update item
   *
   * @param {item} Object
   * @param {save} Boolean
   * @api private
   */
  updateItem: function(item,save) {
    var d = new q.Deferred();
    if (!item) {
      d.reject("Could not remove item: item is empty in shopping #"+this.id);
      return d.promise; 
    }

    var index = -1;
    //if shopping exists: go thru them
    if (item._id && this.items.length) {
        index = utils.indexof(this.items, { _id: item._id });
    }
    //if item exist: update it
    if (~index) {
      //ensure that the update is not overriding the database
      if (!this.items[index].updatedAt || !item.updatedAt || new Date(item.updatedAt) >= this.items[index].updatedAt) {
        this.items[index].title = item.title;
        this.items[index].completed = item.completed;
        if (item.updatedAt) this.items[index].updatedAt = new Date(item.updatedAt);
        else                this.items[index].updatedAt = new Date();
        if (item.deletedAt) this.items[index].deletedAt = item.deletedAt;
      }
    }
    //otherwise add it to the list
    else {
      this.items.push(item);
    }

    if (save) {
      //save if necessary
      this.save(function(err,saved){
        if (err) return d.reject(err);
        return d.resolve(saved);
      });
      
    }
    else {
      d.resolve(this);
    }

    return d.promise;
  },

  /**
   * Update items
   *
   * @param {items} Array of items 
   * @param {save} Boolean
   * @api private
   */
  updateItems: function(items,save) {
    var d = new q.Deferred();
    var requests = [];
    //handle arrays as items to remove
    for(var i=0;i<items.length;i++) {
      requests.push(this.updateItem(items[i],false));
    }
    q.all(requests).then(function(saved){
      if (save) {
        this.save(function(err,saved){
          if (err) return d.reject(err);
          return d.resolve(saved);
        });
      } 
      else {
        return d.resolve(this);
      }
    }
    .bind(this),
    function(err){
      return d.reject(err);
    });
    return d.promise;
  },

  /**
   * Remove item
   *
   * @param {itemId} String
   * @param {save} Boolean
   * @api private
   */
  removeItem: function (itemId, save) {
    var d = new q.Deferred();
    if (!itemId) {
      d.reject("Could not remove item: itemId is empty in shopping #"+this.id);
      return d.promise; 
    }

    //remove from one item ID
    if (this.items && this.items.length) {
      var index = utils.indexof(this.items, { id: itemId });
      if (~index) this.items[index].deletedAt = new Date();
      else {
        d.reject("Could not remove item '"+itemId+"': item not found in shopping #"+this.id);
        return d.promise; 
      }
    }
    if (save) {
      //save if necessary
      this.save(function(err,saved){
        if (err) return d.reject(err);
        return d.resolve(saved);
      });
      
    }
    else {
      d.resolve(this);
    }

    return d.promise;
  },

  /**
   * Remove items
   *
   * @param {items} Array of items IDs
   * @param {save} Boolean
   * @api private
   */
  removeItems : function(items,save) {
    var d = new q.Deferred();
    var requests = [];
    //handle arrays as items to remove
    for(var i=0;i<items.length;i++) {
      requests.push(this.removeItem(items[i],false));
    }
    q.all(requests).then(function(saved){
      if (save) {
        this.save(function(err,saved){
          if (err) return d.reject(err);
          return d.resolve(saved);
        });
      } 
      else {
        return d.resolve(this);
      }
    }
    .bind(this),
    function(err){
      return d.reject(err);
    });
    return d.promise;
  }

};

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

  load: function (id) {
    return this.findOne({ _id : id })
      .populate('group')
      .exec();
  },

  /**
   * Current shopping
   *
   * @param {groupId} String
   * @api private
   */

  current: function (group) {
    return this.findOne({group:group, archivedAt: null})
      .populate('group')
      .exec();
  },

  /**
   * List shopping archives
   *
   * @param {groupId} String
   * @api private
   */

  archiveList: function (groupId) {
    return this.find({group:groupId, archivedAt: {'$ne': null }}) 
      .populate('group')
      .sort({'createdAt': -1}) // sort by date
      .exec();
  }

};

mongoose.model('Shopping', ShoppingSchema);
