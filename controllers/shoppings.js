/**
 * Module dependencies.
 */

 var mongoose = require('mongoose'),
 Shopping = mongoose.model('Shopping'),
 utils = require('../lib/utils'),
 extend = require('util')._extend,
 q = require('promised-io/promise'),
 socket = null;

//init the controller with the Socket.IO instance
exports.initController = function(sock) {
  socket = sock;
};

/**
 * Load
 */

 exports.load = function(req, res, next, id){

  Shopping.load(id)
  .then(function(shopping) {
    if (!shopping) return next(new Error('not found'));
    req.shopping = shopping;
    next();
  },
  function(err){
    return next(err || "Error loading the shopping "+id);
  });
};

var getCurrentShoppingListData = function(group) {
  var d = new q.Deferred();

  q.all(
    Shopping.current(group),
    Shopping.archiveList(group)
    )
  .then(function(data) {

    //if the current shopping list does not exist, create it 
    if (!data[0]) {
      var new_shopping = new Shopping({
            group: req.group
          });
      new_shopping.save(function(err, new_shopping_saved) {
        d.resolve({entity_id: new_shopping_saved._id, items: new_shopping_saved.items, archives: data[1] });
      });
    }
    else  {
      //send result with current shopping
      d.resolve({entity_id: data[0]._id, items: data[0].items, archives: data[1] });
    }

  },
  function(err){
    console.error('Error while getting the current shopping list ',err);
    d.reject(err);
  });

  return d.promise;
}

/**
 * Get current shopping list
 */

exports.get = function(req, res) {

  if (!req.user || !req.user.current_group || !req.user.current_group._id) {
    return utils.sendJSON(res,"Unknown current group id.");
  }

  getCurrentShoppingListData(req.group)
  .then(function(data){
     utils.sendJSON(res,null,data);
  },
  function(err){
    console.error('Error while getting a shopping list',err);
    utils.sendJSON(res,"Could not get the shopping list");
  });

};

/**
 * New shopping
 */

 exports.new = function(req, res){

  Shopping.current(req.group)
  .then(function(cshopping) { 

    if (!cshopping) {
      return utils.sendJSON(res,"No current shopping list for group");
    }

    //if there are no items in the old group
    if (cshopping.items.length === 0) {
      //do not archive
      return utils.sendJSON(res,"The current shopping list for group is empty");
    }

    //archive current list
    cshopping.archivedAt = new Date();

    //save the current list
    return cshopping.save();
  })
  .then(function() {
    // create new list
    var shopping = new Shopping({
      group: req.group
    });
    return shopping.save();
  })
  .then(function() {
    //get the current list complete data
    return getCurrentShoppingListData(req.group);
  })
  .then(function(data) {
    // broadcast to rest of group
    socket.broadcastToGroup(req.user,'shopping:list',data);
    //send the complete data to the client
    utils.sendJSON(res,null,data);
  },
    function(err) { 
      console.error('An error occured',err);
      return utils.sendJSON(res,"An error occured :"+err);
    });
};


exports.updateItem = function(req, res) {
  if (req.shopping && req.body.items){
    req.shopping.updateItems(req.body.items,true)
    .then(function(saved){

        // broadcast to rest of group
        socket.broadcastToGroup(req.user,'shopping:list',{items: saved.items});

        //send answer to current user
        utils.sendJSON(res,null,{items: saved.items });

      },
      function(err){
        console.error('Error while updating a shopping list item',err);
        utils.sendJSON(res,"Could not update the shopping list");
      });
  }
  else {
    utils.sendJSON(res,"Could not update the shopping list: Missing parameters");
  }
};

exports.removeItem = function(req, res) {
  if (req.shopping && req.body.items){
    req.shopping.removeItems(req.body.items,true)
    .then(function(saved){

        //broadcast to rest of group
        socket.broadcastToGroup(req.user,'shopping:list',{items: saved.items});

        //send answer to current user
        utils.sendJSON(res,null,{items: saved.items });

      },
      function(err){
        console.error('Error while deleting a shopping list item',err);
        utils.sendJSON(res,"Could not delete the shopping list item");
      });
  }
  else {
    utils.sendJSON(res,"Could not delete the shopping list item: Missing parameters");
  }

};