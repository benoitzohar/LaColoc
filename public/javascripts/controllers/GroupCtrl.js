/*global angular,lca,socket,$,app,log,current_user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('GroupCtrl', function ($rootScope, $scope, $location, $http, lcSocket) {

      $scope.formData = {
        //get the csrf by default from the input
        _csrf: $('input[name="_csrf"]').val()
      };

      $scope.processForm = function(action, isNew) {
        $http({
          method  : (isNew ? 'PUT': 'POST'),
          url     : action,
          data    : $.param($scope.formData),  // pass in data as strings
          headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
       })
        .success(function(res) {
          if (res) {
            if (!res.err) {
              if (res.data && res.data.user) {
                //override current user data with the one from the server
                user = res.data.user;
                $rootScope.user = res.data.user;
              }
            }
            else {
              //@TODO: handle error from server, maybe on a general level ??
            }
          }
        });
      };


       app.hideLoader();
    });

})();