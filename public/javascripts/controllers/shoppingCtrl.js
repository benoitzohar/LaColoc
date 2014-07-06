/*global angular,lca,socket,$,log,app */
/*jshint unused:false */
(function () {
'use strict';

	 lca.controller('ShoppingCtrl', ['$scope', '$location', 'lcSocket', 'filterFilter', function ($scope, $location, lcSocket, filterFilter) {
		app.showLoader();
		var shoppings = $scope.shoppings = [];
		var entity_id = $scope.entity_id = null;

		$scope.newShopping = '';
		$scope.remainingCount = filterFilter(shoppings, {completed: false}).length;
		$scope.editedShopping = null;

		if ($location.path() === '') {
			$location.path('/');
		}

		$scope.location = $location;

		$scope.$watch('remainingCount == 0', function (val) {
			$scope.allChecked = val;
		});

		//change menu highlights
	    $('.nav li').removeClass('active');
	    $('.nav li.shopping-link').addClass('active');

	    lcSocket.removeAllListeners('shopping:list');
		lcSocket.on('shopping:list',function(data) {
			log(data);
			entity_id = $scope.entity_id = data.entity_id;
			$scope.archives = data.archives;
			//console.log("got shopping:list in ctrl",data);
			$scope.shoppings = shoppings = data.items;
			app.hideLoader();
		});


		$scope.addShopping = function () {
			var newShopping = $scope.newShopping.trim();
			if (newShopping.length === 0) {
				return;
			}
			var shopping = {
				title: newShopping,
				completed: false
			};
			shoppings.push(shopping);
			lcSocket.emit('shopping:update',[shopping], entity_id);

			$scope.newShopping = '';
			$scope.remainingCount++;
		};

		$scope.editShopping = function (shopping) {
			$scope.editedShopping = shopping;
			// Clone the original shopping to restore it on demand.
			$scope.originalShopping = angular.extend({}, shopping);
		};

		$scope.doneEditing = function (shopping) {
			$scope.editedShopping = null;
			shopping.title = shopping.title.trim();

			if (!shopping.title) {
				$scope.removeShopping(shopping);
			}
			else lcSocket.emit('shopping:update',[shopping], entity_id);
		};

		$scope.revertEditing = function (shopping) {
			shoppings[shoppings.indexOf(shopping)] = $scope.originalShopping;
			$scope.doneEditing($scope.originalShopping);
		};

		$scope.removeShopping = function (shopping) {
			$scope.remainingCount -= shopping.completed ? 0 : 1;
			shoppings.splice(shoppings.indexOf(shopping), 1);
			if (shopping && shopping._id) {
				lcSocket.emit('shopping:remove',[shopping._id], entity_id);
			}
		};

		$scope.shoppingCompleted = function (shopping) {
			$scope.remainingCount += shopping.completed ? -1 : 1;
			lcSocket.emit('shopping:update',[shopping], entity_id);
		};

		//init view
	    lcSocket.emit('shopping:get');  
	}]);

})();
