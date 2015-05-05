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

  /**
   *  Localstorage helper
   */
  lca.factory('$db', ['$window', function($window) {

    var secret = "This is a great lacoloc secret.";

    //encryption layer
    var encrypt = function(message) {
      if (!message) return "";
      return CryptoJS.TripleDES.encrypt(message, secret);
    };

    var decrypt = function(encrypted) {
      if (!encrypted) return "";
      var decrypted = CryptoJS.TripleDES.decrypt(encrypted, secret);  
      return decrypted.toString(CryptoJS.enc.Utf8);
    };


    return {
      set: function(key, value) {
        $window.localStorage[key] = encrypt(value);
      },
      get: function(key, defaultValue) {
        return decrypt($window.localStorage[key]) || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = encrypt(JSON.stringify(value));
      },
      getObject: function(key) {
        return JSON.parse(decrypt($window.localStorage[key]) || '{}');
      }
    };
  }]);


})();