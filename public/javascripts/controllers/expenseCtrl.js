/*global angular,lca,socket,$,app,log,current_user */
/*jshint unused:false */
(function () {
'use strict';

    lca.controller('ExpenseCtrl', ['$scope', '$location', 'lcSocket', '$filter', function ($scope, $location, lcSocket, $filter) {
        app.showLoader();
        var expenses = $scope.expenses = [];
        $scope.archives = [];
        var owes = $scope.owes = [];
        var entity_id = $scope.entity_id = null;

        $scope.newExpenseTitle = '';
        $scope.newExpenseDate = $filter('date')(new Date(),app.config.angular_date_format);
        $scope.newExpenseValue = '';
        $scope.grandTotal = 0;
        $scope.editedExpense = null;
        $scope.newExpenseDateObject = new Date().getTime();

        if ($location.path() === '') {
            $location.path('/');
        }

        $scope.location = $location;

        $scope.$watch('remainingCount == 0', function (val) {
            $scope.allChecked = val;
        });

        //change menu highlights
        $('.nav li').removeClass('active');
        $('.nav li.expenses-link').addClass('active');

        //remove existing listeners from socket
        lcSocket.removeAllListeners('expense:list');
        lcSocket.on('expense:list',function(data) {
            log(data);
            if (data.entity_id) entity_id = $scope.entity_id = data.entity_id;
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
                        if (current_user == users[i].user._id) {
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
                            user: current_user,
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
        });

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

            lcSocket.emit('expense:add', [expense], entity_id);

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
            else lcSocket.emit('expense:update',[expense], entity_id);
        };

        $scope.revertEditing = function (expense) {
            expenses[expenses.indexOf(expense)] = $scope.originalExpense;
            $scope.doneEditing($scope.originalExpense);
        };

        $scope.removeExpense = function (expense) {
            var id = expense._id;
            expenses[0].items.splice(expenses[0].items.indexOf(expense), 1);
            if (id) {
                lcSocket.emit('expense:remove',[id], entity_id);
            }
        };

        $scope.toggleDest = function(dest) {
            log('dest',dest);
        };

        //init view
        lcSocket.emit('expense:get');  

    }]);

})();