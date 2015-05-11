/*global angular,lca,socket,$,app,log,current_user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('ExpenseCtrl', function ($rootScope,$scope, $location, lcSocket, lcApi, $filter) {

        //change menu highlights
        $('.nav li').removeClass('active');
        $('.nav li.expenses-link').addClass('active');

        //show loader
        app.showLoader();

        var expenses = $scope.expenses = [];
        $scope.archives = [];
        var owes = $scope.owes = [];
        $scope.entity_id = null;

        $scope.newExpenseTitle = '';
        $scope.newExpenseDate = $filter('date')(new Date(),app.config.angular_date_format);
        $scope.newExpenseValue = '';
        $scope.grandTotal = 0;
        $scope.editedExpense = null;
        $scope.newExpenseDateObject = new Date().getTime();

        $scope.location = $location;

        $scope.$watch('remainingCount == 0', function (val) {
            $scope.allChecked = val;
        });

      
        var handleData = function(data) {
            log(data);
            if (data.entity_id) $scope.entity_id = data.entity_id;
            $scope.archives = data.archives;
            var expense = data.expense;
            if (expense) {
                //console.log("got expense:list in ctrl",data);
                //set the current user at the beggining of the data
                if (expense.users) {
                    var users = expense.users,
                        exp = [],
                        current_user_found = false;

                    for(var i=0;i<users.length;i++) {
                        if (!users[i].user || !users[i].user._id) continue;

                        users[i].total = Math.round(users[i].total*100)/100;
                        if ($rootScope.user._id == users[i].user._id) {
                            users[i].is_current_user = 1;
                            exp.unshift(users[i]);
                            current_user_found = true;
                        }
                        else   
                            exp.push(users[i]);
                    }

                    //make sure the current user can get things done
                    if (!current_user_found) {
                        exp.unshift({
                            user: user,
                            items : []
                        });
                    }

                    $scope.expenses = exp;
                    expenses = exp;
                }

                if (expense.owes) {
                    $scope.owes = expense.owes;
                    owes = expense.owes;
                }

                $scope.grandTotal = Math.round(expense.total*100)/100;
            }

            app.hideLoader();
        };

        var getData = function(cb) {
            lcApi.get('/expense')
                .then(function(data) {
                    if (cb) cb();
                    handleData(data);
                },
                function(err){
                    //custom handling of the error 
                    //(the main handling is done in the service)
                    app.hideLoader();
                });
        };

        //remove existing listeners from socket
        lcSocket.removeAllListeners('expense:list');
        lcSocket.on('expense:list',handleData);

        var doUpdateItems = function(action,items) {
            lcApi.post('/expense/'+$scope.entity_id+'/'+action+'Item',{items: items})
            .then(handleData);
        }

        /**
         *  Scope Functions
         */

        $scope.addExpense = function () {

            if (!$scope.addexpenseform.$valid) return;

            var newExpenseTitle = $scope.newExpenseTitle ? $scope.newExpenseTitle.trim() : '',
                newExpenseDate = $scope.newExpenseDateObject,
                newExpenseValue = $scope.newExpenseValue ? $scope.newExpenseValue.trim().replace(',','.') : '';

            if (isNaN(newExpenseValue)) {
                return;
            }
            
            if (newExpenseTitle.length === 0 || newExpenseDate.length === 0) {
                return;
            }
            var expense = {
                title: newExpenseTitle,
                date: newExpenseDate,
                value: newExpenseValue
            };

            if (!expenses[0].items) expenses[0].items = [];
            expenses[0].items.push(expense);

            doUpdateItems('update',[expense])

            $scope.newExpenseTitle = '';
            $scope.newExpenseDate = $filter('date')(new Date(),app.config.angular_date_format);
            $scope.newExpenseValue = '';
            $scope.newExpenseDateObject = new Date().getTime();

            $scope.addexpenseform.$setPristine();
        };

        $scope.editExpense = function (expense) {
            $scope.editedExpense = expense;
            // Clone the original expense to restore it on demand.
            $scope.originalExpense = angular.extend({}, expense);
        };

        $scope.doneEditing = function (expense) {
            $scope.editedExpense = null;
            expense.title = expense.title.trim();

            if (!expense.title) {
                $scope.removeExpense(expense);
            }
            else doUpdateItems('update',[expense])
        };

        $scope.revertEditing = function (expense) {
            expenses[expenses.indexOf(expense)] = $scope.originalExpense;
            $scope.doneEditing($scope.originalExpense);
        };

        $scope.removeExpense = function (expense) {
            var id = expense._id;
            expenses[0].items.splice(expenses[0].items.indexOf(expense), 1);
            if (id) {
                doUpdateItems('remove',[id])
            }
        };

        $scope.toggleDest = function(dest) {
            log('dest',dest);
        };

        $scope.doArchive = function() {
            //do the action
            lcApi.put('/expense')
                .then(handleData, 
                app.hideLoader);
        };


       
        /**
         * init view:
         **/
        
        //get data from the server
        getData();

    });

})();