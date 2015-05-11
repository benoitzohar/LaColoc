/*global angular,lca,socket,$,app,log,user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('MenuCtrl', function ($scope, $location,$modal, lcApi) {

      $scope.openModal = function (url) {

        var modalInstance = $modal.open({
          animation: true,
          templateUrl: url,
          //controller: 'ModalInstanceCtrl',
          size: 'large',
          resolve: {
            items: function () {
              return $scope.items;
            }
          }
        });

        modalInstance.result.then(function (selectedItem) {
          console.log('selectedItem',selectedItem);
          $scope.selected = selectedItem;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
      };



    });

})();