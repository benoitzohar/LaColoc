/*global shoppingmvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the shoppingStorage service
 * - exposes the model to the template and provides event handlers
 */
lcangular.controller('ShoppingCtrl', function ShoppingCtrl($scope, $location, lcSocket, filterFilter) {
	var shoppings = $scope.shoppings = [];

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

	lcSocket.on('shopping:list',function(data) {
		//console.log("got shopping:list in ctrl",data);
		$scope.shoppings = data;
		shoppings = data;
		$('.angular-hider').removeClass('hidden')
		$('.angular-shower').addClass('hidden')
	})


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
		lcSocket.emit('shopping:update',[shopping]);

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
		else lcSocket.emit('shopping:update',[shopping]);
	};

	$scope.revertEditing = function (shopping) {
		shoppings[shoppings.indexOf(shopping)] = $scope.originalShopping;
		$scope.doneEditing($scope.originalShopping);
	};

	$scope.removeShopping = function (shopping) {
		$scope.remainingCount -= shopping.completed ? 0 : 1;
		shoppings.splice(shoppings.indexOf(shopping), 1);
		if (shopping && shopping._id) {
			lcSocket.emit('shopping:remove',[shopping._id]);
		}
	};

	$scope.shoppingCompleted = function (shopping) {
		$scope.remainingCount += shopping.completed ? -1 : 1;
		lcSocket.emit('shopping:update',[shopping]);
	};
});
