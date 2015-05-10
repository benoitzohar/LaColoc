/*global angular,lca,socket,$,app,log,current_user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('AppCtrl', function ($rootScope, $scope, $location, lcSocket) {
        app.showLoader();

        $rootScope.user = user;
        console.log('user',user);

        //test for data existence
        if (!user.current_group) {
          //only show the "new group" (no modal)
          $location.path('/groups/new/0');
          //watch for user object change, then reload current page
          $rootScope.$watch('user',function(newVal, oldVal){
            //ensure that the object really changed
            if (JSON.stringify(newVal) != JSON.stringify(oldVal)) {
                if ($rootScope.user.current_group) {
                    $location.path('/expenses');
                }
            }
          });
        }
        else {
          //Redirect to main app :expenses
          $location.path('/expenses');
        }

    });

})();