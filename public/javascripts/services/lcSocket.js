/*global shoppingmvc */
'use strict';

/**
 * Services that persists and retrieves data from localStorage
*/
lcangular.factory('lcSocket', function ($rootScope) {
	return {
        on: function (eventName, callback, uniqueName) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, entity_id, callback) {
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
          })
        },
        removeAllListeners: function(eventName) {
          socket.removeAllListeners(eventName);
        }
      };
});
