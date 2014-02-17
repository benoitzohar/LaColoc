/*global shoppingmvc */
'use strict';

/**
 * Services that persists and retrieves data from localStorage
*/
lcangular.factory('lcSocket', function ($rootScope) {
	return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
        //add shopping id by default
          if (app && app.current_shopping_id) {
            data = {
                shopping_id : app.current_shopping_id,
                items : data
            };
          }

          //add expense id by default
          if (app && app.current_expense_id) {
            data = {
                expense_id : app.current_expense_id,
                items : data
            };
          }

          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
});
