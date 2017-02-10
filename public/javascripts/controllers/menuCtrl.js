/*global angular,lca,socket,$,app,log,user */
/*jshint unused:false */
(function() {
    'use strict';

    lca.controller('MenuCtrl', function($scope, $location, $uibModal, $log, lcApi) {

        $scope.openModal = function(url, controller) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: url,
                controller: controller,
                size: 'large',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

        };



    });

})();
