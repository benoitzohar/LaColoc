/*global angular,lca,socket,$,app,log,current_user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('AppCtrl', function ($rootScope, $scope, $location, lcSocket) {
        app.showLoader();

        $rootScope.user = user;

    });

})();