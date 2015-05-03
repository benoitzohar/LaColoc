
/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 config = require('../config/config'),
  // imagerConfig = require(config.root + '/config/imager.js'),
  // Imager = require('imager'),
  Schema = mongoose.Schema,
  utils = require('../lib/utils'),
  q = require('promised-io/promise');


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
      dest : [{type : Schema.ObjectId, ref : 'User' }],
      createdAt: { type : Date, default : Date.now }
    }],
    total: {type: Number, default: 0},
    diff: {type: Number, default: 0}
  }],
  owes : [{
    from:{type : Schema.ObjectId, ref : 'User' },
    to:{type : Schema.ObjectId, ref : 'User' },
    val: {type: Number, default: 0},
  }],
  paid : [{
    from:{type : Schema.ObjectId, ref : 'User' },
    to:{type : Schema.ObjectId, ref : 'User' },
    val: {type: Number, default: 0},
  }],
  total: Number,
  createdAt  : {type : Date, default : Date.now},
  archivedAt : {type : Date }
})

/**
 * Pre-save hook
 */

 ExpenseSchema.pre('save', function (next) {
  
  //calculate all totals and shit (and prepare lines for owes)

  var grand_total = 0,
  lines = [],
  dist = {},
  distar = [],
  error = false,
  that = this;

  if (that.group && that.group.populate) {
    that.group.populate('users',function(){


      for(var i=0;i<that.users.length;i++) {
        var u = that.users[i],
        total = 0;

        for(var j=0;j<u.items.length;j++) {
          var it = u.items[j];
          total += it.value || 0;

        //make sure everyone is included
        if (!it.dest || it.dest.length === 0) {
          for(var k=0;k<that.group.users.length;k++) {
            if (that.group.users[k]) {
                //make sure the dest exists
                if (!it.dest) it.dest = []; 
                //add to db array
                it.dest.push(that.group.users[k]);
              }
            }
          }
        //make sure the users still exists
        else {
          for(var k=it.dest.length-1;k>=0;k--) {
            if (!that.group.hasUser(it.dest[k]._id)) {
              delete it.dest[k];
            }
          }
        }

        //push to lines (for owes)
        if (it.dest.length > 0) {
          lines.push({val: it.value || 0, who: u.user, f:it.dest });
        }
      }

      //get total for user
      that.users[i].total = total;
      // increment total for all users
      grand_total += total;
    }

    for(var i=0;i<that.users.length;i++) {
      that.users[i].diff = parseInt((that.users[i].total - (grand_total / that.users.length)) * 100,10)/ 100;
    }

    that.total = Math.round(grand_total*100)/100;

    /**
    * calculate owes
    **/

    //reset owes
    that.owes = [];

    //remove paid (add inverse lines)
    for(var i=0;i<that.paid.length;i++) {
      lines.push({
        val: that.paid[i].val,
        who: that.paid[i].from,
        f: [that.paid[i].to]
      })
    }

    for(var i=0;i<lines.length;i++) {
      var l = lines[i]
      
      for(var p=0;p<l.f.length;p++) {
            //add value of user to dist
            if (!dist[l.f[p]._id]) dist[l.f[p]._id] = 0;
            dist[l.f[p]._id] += utils.roundFloat(l.val/l.f.length);
          }
        //remove value from paying user to dist
        if (!dist[l.who._id]) dist[l.who._id] = 0;
        dist[l.who._id] -= l.val;
      }

    //add dists in array
    for(var k in dist) {
      if (utils.roundFloat(dist[k],1))
        distar.push([k,utils.roundFloat(dist[k])]);
    }

    //owes
    while (distar.length > 0) {
        //sort array
        distar.sort(function(a,b){
          return b[1]-a[1];
        });
        
        if (distar.length > 1 && distar[0] && distar[distar.length-1]) {
          var f = distar[0], 
          l = distar[distar.length-1];
          
            //if first is more than last (abs(last))
            if (utils.roundFloat(f[1] + l[1],10) > 0) {
                //get diff 
                var diff = -l[1];
                //add owe
                that.owes.push({
                  from: f[0], 
                  to: l[0],
                  val: utils.roundFloat(diff)
                });
                //down the first
                distar[0][1] = f[1]-diff;
                //remove the last
                distar.pop();
              }
            //else if first is equal to last (abs(last))
            else if(utils.roundFloat(f[1] + l[1],10) == 0) {
                //add owe
                that.owes.push({
                  from: f[0],
                  to: l[0],
                  val: utils.roundFloat(f[1])
                });
                //remove the first and the last
                distar.pop();
                distar.shift();

              }
            //else if first is less than last (abs(last))
            else {
                //add owe
                that.owes.push({
                  from: f[0],
                  to: l[0],
                  val: utils.roundFloat(0-l[1]-f[1])
                });
                //down the last
                distar[distar.length-1][1] = l[1]+f[1];
                //remove the first
                distar.shift();
              }
            }
            else {
              errror = true;
              break;
            }
          }

          if (distar.length > 0) {
            error = true;
            console.log('calcul error',that);
          }


          next()
        });
}
else {
  that.total = 0;
  next();
}
});

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
      });
      index = this.users.length-1;
    }
    
    this.users[index].items.push(item);
    if (cb) this.save(cb);
  },

  updateItem: function(user,item,cb) {
    var indexUser = this.getUserIndex(user._id);
    if (~indexUser) {
      var indexItem = this.getItemIndexForUserId(user._id,item._id);
      if (~indexItem) {
        this.users[indexUser].items[indexItem].title = item.title;
        this.users[indexUser].items[indexItem].value = item.value;
        this.users[indexUser].items[indexItem].date = item.date;
        if (cb) this.save(cb);
      }
    }

  },
  removeItem: function(user,itemId,cb) {
    var indexUser = this.getUserIndex(user._id);
    if (~indexUser) {
      var indexItem = this.getItemIndexForUserId(user._id,itemId);
      if (~indexItem) {
        this.users[indexUser].items.splice(indexItem,1);
        if (cb) this.save(cb);
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

};

/**
 * Statics
 */

 ExpenseSchema.statics = {

 /**
   * Find expense by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

   load: function (id, cb) {
    this.findOne({ _id : id })
    .populate('group')
    .populate('users.user')
    .populate('users.items.dest')
    .populate('owes.from')
    .populate('owes.to')
    .exec(cb);
  },

  /**
   * Current expense
   *
   * @param {groupId} String
   * @param {Function} cb
   * @api private
   */

   current: function (group,cb) {
    var d = new q.Deferred();
    this.findOne({group:group, archivedAt: null})
    .populate('group')
    .populate('users.user')
    .populate('users.items.dest')
    .populate('owes.from')
    .populate('owes.to')
    .exec(function(err,val){
      if (err) return d.reject(err);
      return d.resolve(val);
    });

    return d.promise;
  },

  /**
   * List shopping archives
   *
   * @param {groupId} String
   * @param {Function} cb
   * @api private
   */

   archiveList: function (groupId, cb) {
    var d = new q.Deferred();
    this.find({group:groupId, archivedAt: {'$ne': null }}) 
    .populate('group')
    .populate('users.user')
      .sort({'createdAt': -1}) // sort by date
      .exec(function(err,val){
        if (err) return d.reject(err);
        return d.resolve(val);
      });

      return d.promise;
    }

  };

  mongoose.model('Expense', ExpenseSchema);
