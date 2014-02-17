var   mongoose = require('mongoose')
    , utils = require('../lib/utils')
    , User = mongoose.model('User')
    , Group = mongoose.model('Group')
    , Shopping = mongoose.model('Shopping')
    , Expense = mongoose.model('Expense')
/**
 * Expose socket config
 */

module.exports = function (express, io, passportSocketIo, sessionstore) {

  // set authorization for socket.io
  io.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser,
    key:         'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret:      'itsnosecrethaha',    // the session_secret to parse the cookie
    store:       sessionstore,        // we NEED to use a sessionstore. no memorystore please
    success:     onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail:        onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));
  
  // enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);

  function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
  }

  function onAuthorizeFail(data, message, error, accept){
    if(error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
  }

  var sock_grps = {};

 // broadcast data only to users of current group
  function broadcastToGroup(user,eventname,data) {
    if (user && user.current_group && sock_grps[user.current_group]) {
      for(var i=0;i<sock_grps[user.current_group].length;i++) {
        sock_grps[user.current_group][i].emit(eventname,data);
      }
    }
  }
  
  /**
   *  Socket routes
   **/
  io.sockets.on('connection', function (socket) {
    var cuser = socket.handshake.user;
    //add current user to his socket group
    if (!sock_grps[cuser.current_group]) sock_grps[cuser.current_group] = [];
    sock_grps[cuser.current_group].push(socket);

    console.log('User '+cuser.email+" connected (group="+cuser.current_group+")")
    broadcastToGroup(cuser,'user:connected',cuser.id);

    socket.on('disconnect',function(){
      //on disconnect:
      console.log('User '+cuser.email+" disconnected (group="+cuser.current_group+")")
      //alert others
      broadcastToGroup(cuser,'user:disconnected',cuser.id);
      //remove from socketgroup
      if (sock_grps[cuser.current_group] && typeof sock_grps[cuser.current_group] == "array") {
        var index = utils.indexof(sock_grps[cuser.current_group],{id: socket.id});
        if (~index) sock_grps.splice(index,1);
      }
    })

    //Shopping
    socket.on('shopping:get',function(data) {
      console.log("shopping:get request received from=",cuser.email);
      if (data && data.shopping_id) {
        
        Shopping.load(data.shopping_id,function(err,shopping) {
          if (shopping && shopping.items)
            socket.emit('shopping:list',shopping.items);
        })
      }
    });

    socket.on('shopping:update',function(data) {
      console.log("shopping.update request received from=",cuser.email,data);
      if (data && data.shopping_id) {
        Shopping.load(data.shopping_id,function(err,shopping) {
          //sync list of items
          if (shopping && shopping.items && data.items){

            if (shopping.items.length) {
              for(var i=0;i<shopping.items.length;i++) {
                var item = shopping.items[i];
                if (!item._id) continue;
                var index = utils.indexof(data.items, { _id: item._id+'' })
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
              broadcastToGroup(cuser,'shopping:list',saved.items);
            })
            
          }
        })
      }
    })

  //Expense
    socket.on('expense:get',function(data) {
      console.log("expense:get request received from=",cuser.email);
      if (data && data.expense_id) {
        
        Expense.load(data.expense_id,function(err,expense) {
          if (expense)
            socket.emit('expense:list',expense);
        })
      }
    });

    socket.on('expense:update',function(data) {
      console.log("expense.update request received from=",cuser.email,data);
      if (data && data.expense_id) {
        Expense.load(data.expense_id,function(err,expense) {
          //sync list of items
          if (expense && expense.users && data.items) {
            console.log('data.items',data.items);
            var indexUser = expense.getUserIndex(cuser._id);
            //if user exists : try to sync list
            console.log("indexUser=",indexUser)
            if (~indexUser) {
              var useritems = expense.users[indexUser].items;
              if (useritems.length) {
                for(var i=0;i<useritems.length;i++) {
                  var item = useritems[i];
                  if (!item._id) continue;
                  var index = utils.indexof(data.items, { _id: item._id+'' })
                  //if item exists in incoming list
                  if (~index) {
                    //try to update
                    expense.updateItem(cuser,data.items[index])
                    //clean incoming list
                    delete data.items[index];
                  }
                  else {
                    //remove item from list
                    expense.removeItem(cuser,item._id)
                  }
                }
              }
              
              //get the added items
              for(var k in data.items) {
                expense.addItem(cuser,data.items[k]);
              }
              
              expense.save(function(err,saved) {
                broadcastToGroup(cuser,'expense:list',saved);
              })
            }
            //else :add all items
            else {
                for(var i=0;i<data.items.length;i++) {
                  console.log("Adding data.items[i]:",data.items[i])
                  expense.addItem(cuser,data.items[i]);
                }

                 expense.save(function(err,saved) {
                  broadcastToGroup(cuser,'expense:list',saved);
                })
            }
          }

        })
      }
    })
    
  });

}