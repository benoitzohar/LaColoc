/*global lca,socket */
(function () {
'use strict';

  /**
   * Service that handle the socket
  */
  lca.factory('lcSocket', function ($rootScope) {
  	return {
          on: function (eventName, callback) {
            socket.on(eventName, function () {  
              var args = arguments;
              $rootScope.$apply(function () {
                callback.apply(socket, args);
              });
            });
          },
          emit: function (eventName, data, entity_id, callback) {

            //show loader after 3 seconds (if the response is long to come)
            app.showLoader(3);

            //format data for socket        
            data = {
                entity_id : entity_id,
                items : data
            };          

            socket.emit(eventName, data, function () {
              var args = arguments;
              $rootScope.$apply(function () {
                if (callback) {
                  callback.apply(socket, args);
                }
              });
            });
          },
          removeAllListeners: function(eventName) {
            socket.removeAllListeners(eventName);
          }
        };
  });

})();