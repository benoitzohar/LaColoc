/*global angular,lca,socket,$,log,app */
/*jshint unused:false */
(function () {
'use strict';

	 lca.controller('ShoppingCtrl', function ($scope, $location, lcSocket, filterFilter,SweetAlert, $db, $http) {
		app.showLoader();

		//get data from the localstorage
		var storedData = $db.getObject('shopping-alldata');
		var shoppings = $scope.shoppings = storedData.items;
		$scope.entity_id = storedData.entity_id;
		$scope.archives = storedData.archives;

		$scope.entity_id = null;
		$scope.readonly = null;

		//var to display deleted rows
		$scope.displayDeleted = $db.get('shopping-displayDeleted',0)==="1";
		//watch for change and store it in the localstorage
		$scope.$watch('displayDeleted', function(val){
			$db.set('shopping-displayDeleted',val?"1":"0");
		});
		//var to display finished rows
		$scope.displayFinished = $db.get('shopping-displayFinished',"1")==="1";
		//watch for change and store it in the localstorage
		$scope.$watch('displayFinished', function(val){
			$db.set('shopping-displayFinished',val?"1":"0");
		});

		//display order
		$scope.orderBy = $db.get('shopping-orderby','date');
		//watch for change and store it in the localstorage
		$scope.$watch('orderBy', function(val){
			$db.set('shopping-orderBy',val);
		});

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
			
			//reset readonly status
			$scope.readonly = false;

			//get the stored data (to update it)
			var storedData = $db.getObject('shopping-alldata');

			//get entity_id
			if (data.entity_id) {
				$scope.entity_id = storedData.entity_id = data.entity_id;
			}
			//get archives (if passed up)
			if (data.archives) {
				$scope.archives = storedData.archives = data.archives;
			}
			//save shoppings
			$scope.shoppings = shoppings = storedData.items = data.items;

			$db.setObject('shopping-alldata',storedData);
			app.hideLoader();
		});


		$scope.addShopping = function () {
			if ($scope.readonly) return false;
			var newShopping = $scope.newShopping.trim();
			if (newShopping.length === 0) {
				return;
			}
			var shopping = {
				title: newShopping,
				completed: false
			};
			shoppings.push(shopping);
			lcSocket.emit('shopping:update',[shopping], $scope.entity_id);

			$scope.newShopping = '';
			$scope.remainingCount++;
		};

		$scope.editShopping = function (shopping) {
			if ($scope.readonly || shopping.deletedAt) return false;
			$scope.editedShopping = shopping;
			// Clone the original shopping to restore it on demand.
			$scope.originalShopping = angular.extend({}, shopping);
		};

		$scope.doneEditing = function (shopping) {
			if ($scope.readonly) return false;
			$scope.editedShopping = null;
			shopping.title = shopping.title.trim();

			if (!shopping.title) {
				$scope.removeShopping(shopping);
			}
			else lcSocket.emit('shopping:update',[shopping], $scope.entity_id);
		};

		$scope.revertEditing = function (shopping) {
			if ($scope.readonly) return false;
			shoppings[shoppings.indexOf(shopping)] = $scope.originalShopping;
			$scope.doneEditing($scope.originalShopping);
		};

		$scope.removeShopping = function (shopping) {
			if ($scope.readonly) return false;
			$scope.remainingCount -= shopping.completed ? 0 : 1;
			shoppings.splice(shoppings.indexOf(shopping), 1);
			if (shopping && shopping._id) {
				lcSocket.emit('shopping:remove',[shopping._id], $scope.entity_id);
			}
		};

		$scope.shoppingCompleted = function (shopping) {
			if ($scope.readonly) return false;
			$scope.remainingCount += shopping.completed ? -1 : 1;
			lcSocket.emit('shopping:update',[shopping], $scope.entity_id);
		};

		$scope.showArchive = function(archive) {

			//if we were already watching an archive
			if ($scope.readonly) {
				//if the current archive is the one already clicked, get out
				if (archive.current) {
					return $scope.hideArchive();
				}

				//go thru all the archives to remove the 'current tag'
				for(var i=0;i<$scope.archives.length;i++) {
					if ($scope.archives[i].current) {
						$scope.archives[i].current = false;
						break;
					}
				}
			} 

			if (archive && archive.archivedAt && archive.items) {
				$scope.readonly = true;
				$scope.shoppings = archive.items;
				//add the current tag to current archive
				archive.current = true;
			}
		};
		$scope.hideArchive = function() {
			lcSocket.emit('shopping:get');  
		};

		$scope.shoppingFilter = function(row) {
			if (!$scope.displayFinished && row.completed) return false;
			if (!$scope.displayDeleted && row.deletedAt) return false;

			return true;
		};

		$scope.askToArchive = function(title, text) {
			SweetAlert.swal({
			   title: title,
			   text: text,
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",
			   closeOnConfirm: true
			}, 
			function(accepted){ 
				if (accepted) {
					//do the action
					$http.get('/shopping/new')
						.success(function(){
							//then reset the list
							lcSocket.emit('shopping:get');
						});
				}
			});
		};

		/**
		 * init view:
		 **/
		
		//get data from the server
	    lcSocket.emit('shopping:get');  

	});

})();
