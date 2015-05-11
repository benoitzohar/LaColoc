/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Expense = mongoose.model('Expense'),
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
  Expense.load(id)
  .then(function (expense) {
    if (!expense) return next(new Error('not found'));
    req.expense = expense;
    next();
  },
  function(err) {
      return next(err || "Error while loading the expense "+id);
  });
};

var getCurrentExpenseListData = function(group, user) {
  var d = new q.Deferred();

  q.all(
    Expense.current(group),
    Expense.archiveList(group)
    )
  .then(function(data) {

    //if the current expense list does not exist, create it 
    if (!data[0]) {
      var new_expense = new Expense({
       group: group,
       users: [{
        user: user,
        items : []
       }]
      })
      new_expense.save(function(err, new_expense_saved) {
        d.resolve({entity_id: new_expense_saved._id, expense: new_expense_saved, archives: data[1] });
      });
    }
    else  {
      //send result with current expense
      d.resolve({entity_id: data[0]._id, expense: data[0], archives: data[1] });
    }

  },
  function(err){
    console.error('Error while getting the current expense list ',err);
    d.reject(err);
  });

  return d.promise;
}

/**
 * Get current expense list
 */

exports.get = function(req, res) {

  if (!req.user || !req.user.current_group || !req.user.current_group._id) {
    return utils.sendJSON(res,"Unknown current group id.");
  }

  getCurrentExpenseListData(req.group, req.user)
  .then(function(data){
     utils.sendJSON(res,null,data);
  },
  function(err){
    console.error('Error while getting a expense list',err);
    utils.sendJSON(res,"Could not get the expense list");
  });

};

/**
 * New expense
 */

exports.new = function(req, res){

    Expense.current(req.group)
    .then(function(cexpense) {

      if (!cexpense) {
      return utils.sendJSON(res,"No current expense list for group");
    }

    //if there are no items in the old group
    if (cexpense.items.length === 0) {
      //do not archive
      return utils.sendJSON(res,"The current expense list for group is empty");
    }

    //archive current list
    cexpense.archivedAt = new Date();

    //save the current list
    return cexpense.save();
  })
  .then(function() {
    // create new list
    var expense = new Expense({
      group: req.group,
       users: [{
        user: req.user,
        items : []
       }]
      })
    return expense.save();
  })
  .then(function() {
    //get the current list complete data
    return getCurrentExpenseListData(req.group, req.user);
  })
  .then(function(data) {
    // broadcast to rest of group
    socket.broadcastToGroup(req.user,'expense:list',data);
    //send the complete data to the client
    utils.sendJSON(res,null,data);
  },
    function(err) { 
      console.error('An error occured',err);
      return utils.sendJSON(res,"An error occured :"+err);
    });
};

exports.updateItem = function(req, res) {
  if (req.expense && req.body.items){
    req.expense.updateItems(req.body.items,req.user,true)
    .then(function(saved){

        // broadcast to rest of group
        socket.broadcastToGroup(req.user,'expense:list',saved);

        //send answer to current user
        utils.sendJSON(res,null,saved);

      },
      function(err){
        console.error('Error while updating a expense list item',err);
        utils.sendJSON(res,"Could not update the expense list");
      });
  }
  else {
    utils.sendJSON(res,"Could not update the expense list: Missing parameters");
  }
};

exports.removeItem = function(req, res) {
  if (req.expense && req.body.items){
    req.expense.removeItems(req.body.items,req.user,true)
    .then(function(saved){

        //broadcast to rest of group
        socket.broadcastToGroup(req.user,'expense:list',saved);

        //send answer to current user
        utils.sendJSON(res,null,saved);

      },
      function(err){
        console.error('Error while deleting a expense list item',err);
        utils.sendJSON(res,"Could not delete the expense list item");
      });
  }
  else {
    utils.sendJSON(res,"Could not delete the expense list item: Missing parameters");
  }

};

/**
 * Show
 */

exports.show = function(req, res){
  if (req.expense) {
    Expense.archiveList(req.group)
    .then(function (archives) {
      res.render('expenses', {
        expense: expense,
        archives: archives
      });
    }, 
    function(err) { return res.render('500'); });
  }
  else {
    res.redirect('/expenses');
  }
}

