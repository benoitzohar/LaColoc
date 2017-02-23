/*global lca,socket */
(function() {
    'use strict';

    /**
     * Service that handle the socket
     */
    lca.factory('lcSocket', function($rootScope) {
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, entity_id, callback) {

                //show loader after 3 seconds (if the response is long to come)
                app.showLoader(3);

                //format data for socket
                data = {
                    entity_id: entity_id,
                    items: data
                };

                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
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
     * Service that handle the API
     */
    lca.factory('lcApi', function($rootScope, $http, $q) {

        var csrf = null;

        var doRequest = function(method, route, data, use_csrf) {

            //show loader after 3 seconds (if the response is long to come)
            app.showLoader(3);

            var d = $q.defer();

            var doReject = function(err) {
                if (!err) err = "Unkown error";

                //@TODO: handle displaying errors
                d.reject(err);

                return false;
            };

            //prepare data
            if (use_csrf && csrf) {
                if (!data) data = {};
                data._csrf = csrf;
            }

            //do the request
            method(route, data)
                .then(function(data, status, headers, config) {
                        if (!data || data.err) {
                            return doReject(data.err);
                        } else if (!data.data) {
                            return doReject("Missing data for route " + route);
                        }

                        //save CSRF for next token
                        if (data.csrf) {
                            csrf = data.csrf;
                        }

                        d.resolve(data.data);
                    },
                    function(data, status, headers, config) {
                        console.error('Error data for route ' + route, data);
                        return doReject(data);
                    });

            return d.promise;

        };

        return {
            get: function(route) {
                return doRequest($http.get, route);
            },
            post: function(route, data) {
                return doRequest($http.post, route, data, true);
            },
            put: function(route, data) {
                return doRequest($http.put, route, data, true);
            },
            delete: function(route) {
                return doRequest($http.delete, route, null, true);
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
