/**
 *  Requires and models
 **/
var   mongoose = require('mongoose'),
      utils = require('../lib/utils'),
      User = mongoose.model('User'),
      Group = mongoose.model('Group'),
      Shopping = mongoose.model('Shopping'),
      Expense = mongoose.model('Expense'),
      config = require('./config'),
      cookieParser = require('cookie-parser'),
      q = require('promised-io/promise');

/**
 *  Local vars
 **/

var sock_grps = {};

/**
 * Socket functions
 **/

function initSocket(express, io, passportSocketIo, sessionstore) {

    console.log('initialized socket');

    // set authorization for socket.io
  io.set('authorization', passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:         'lacoloc.sid',       // the name of the cookie where express/connect stores its session_id
    secret:      'itsnosecrethaha',    // the session_secret to parse the cookie
    store:       sessionstore,        // we NEED to use a sessionstore. no memorystore please
    success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));
  
  // enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
//io.set('transports', config.socket_transports);
  
  /**
   *  Socket routes
   **/
  io.on('connection', function (socket) {
    var cuser = socket.request.user;
    //add current user to his socket group
    if (!sock_grps[cuser.current_group]) sock_grps[cuser.current_group] = [];
    sock_grps[cuser.current_group].push(socket);

    console.log('[Socket.IO] User '+cuser.email+" connected (group="+cuser.current_group+")");
    broadcastToGroup(cuser,'user:connected',cuser.id);

    socket.on('disconnect',function(){
      //on disconnect:
      console.log('[Socket.IO] User '+cuser.email+" disconnected (group="+cuser.current_group+")");
      //alert others
      broadcastToGroup(cuser,'user:disconnected',cuser.id);
      //remove from socketgroup
      if (sock_grps[cuser.current_group] && typeof sock_grps[cuser.current_group] == "object") {
        var index = utils.indexof(sock_grps[cuser.current_group],{id: socket.id});
        if (~index) sock_grps[cuser.current_group].splice(index,1);
      }
    });

    //Shopping
    socket.on('shopping:sync',function(data) {
      console.log("[Socket.IO] shopping.sync request received from=",cuser.email,data);
      if (data && data.entity_id) {
        Shopping.load(data.entity_id,function(err,shopping) {
          //sync list of items
          if (shopping && shopping.items && data.items){

            if (shopping.items.length) {
              for(var i=0;i<shopping.items.length;i++) {
                var item = shopping.items[i];
                if (!item._id) continue;
                var index = utils.indexof(data.items, { _id: item._id+'' });
                //if item exists in incoming list
                if (~index) {
                  //try to update
                  shopping.items[i].title = data.items[index].title;
                  shopping.items[i].completed = data.items[index].completed;
                  //clean incoming list
                  delete data.items[index];
                }
                else {
                  //remove item from list
                  shopping.items.splice(i,1);
                }
              }
            }
            
            //get the added items
            for(var k in data.items) {
              shopping.items.push(data.items[k]);
            }
            
            shopping.save(function(err,saved) {
              broadcastToGroup(cuser,'shopping:list',{items: saved.items});
            });
            
          }
        });
      }
    });

  //Expense
    socket.on('expense:get',function(data) {
      console.log("[Socket.IO] expense:get request received from=",cuser.email);

      q.all(Expense.current(cuser.current_group),Expense.archiveList(cuser.current_group))
      .then(function(res) {
        if (res[0] && res[1]) {
          socket.emit('expense:list',{entity_id: res[0]._id, expense: res[0],  archives : res[1]});
        }
      });

    });
    socket.on('expense:add',function(data) {
      console.log("[Socket.IO] expense.add request received from=",cuser.email,data);
      if (data && data.entity_id) {
        Expense.load(data.entity_id,function(err,expense) {
          //add items to list
          if (expense && expense.users && data.items) {
            for(var k in data.items) {
              expense.addItem(cuser,data.items[k]);
            }
            expense.save(function(err) {
              Expense.load(data.entity_id,function(err,saved) {
                broadcastToGroup(cuser,'expense:list',saved);
              });
            }) ;
          }
        });
      }
    });

    socket.on('expense:update',function(data) {
      console.log("[Socket.IO] expense.update request received from=",cuser.email,data);
      if (data && data.entity_id) {
        Expense.load(data.entity_id,function(err,expense) {
          //add items to list
          if (expense && expense.users && data.items) {
            for(var k in data.items) {
              if (data.items[k] && data.items[k]._id) {
                expense.updateItem(cuser,data.items[k]);
              }
            }
            expense.save(function(err) {
              Expense.load(data.entity_id,function(err,saved) {
                broadcastToGroup(cuser,'expense:list',saved);
              });
            });
          }
        });
      }
    });

    socket.on('expense:remove',function(data) {
      console.log("[Socket.IO] expense.remove request received from=",cuser.email,data);
      if (data && data.entity_id) {
        Expense.load(data.entity_id,function(err,expense) {
          //add items to list
          if (expense && expense.users && data.items) {
            console.log('data.items',data.items);
            for(var k in data.items) {
              if (data.items[k]) {
                expense.removeItem(cuser,data.items[k]);
              }
            }
            expense.save(function(err) {
              Expense.load(data.entity_id,function(err,saved) {
                broadcastToGroup(cuser,'expense:list',saved);
              });
            });
          }
        });
      }
    });
    
  });
}

function onAuthorizeSuccess(data, accept){
  /*console.log('successful connection to socket.io');*/
  // The accept-callback still allows us to decide whether to
  // accept the connection or not.
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.error('failed connection to socket.io:', message);
  // We use this callback to log all of our failed connections.
  accept(null, false);
}

//error logger for the socket
function onError(err,route) {
  console.error("[Socket.IO] An error occured for event '"+route+"': ",err);
}

// broadcast data only to users of current group
function broadcastToGroup(user,eventname,data) {

  if (!user || !user.current_group) {
    return false;
  }

  var groupid = user.current_group;
  if (typeof user.current_group == "object" && user.current_group._id) {
    groupid = user.current_group._id;
  } 

  if (sock_grps[groupid]) {
    for(var i=0;i<sock_grps[groupid].length;i++) {
      sock_grps[groupid][i].emit(eventname,data);
    }
  }
}


/**
 * Expose socket config
 */

module.exports = function () {

  return {
    initSocket : initSocket,
    broadcastToGroup: broadcastToGroup
  };

};