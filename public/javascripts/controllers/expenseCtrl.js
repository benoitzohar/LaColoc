/*global expensemvc, angular */
'use strict';

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the expenseStorage service
 * - exposes the model to the template and provides event handlers
 */
lcangular.controller('ExpenseCtrl', function ExpenseCtrl($scope, $location, lcSocket, filterFilter) {
    var expenses = $scope.expenses = [];

    $scope.newExpenseTitle = '';
    $scope.newExpenseDate = '';
    $scope.newExpenseValue = '';
    $scope.grandTotal = 0;
    $scope.editedExpense = null;

    if ($location.path() === '') {
        $location.path('/');
    }

    $scope.location = $location;

    $scope.$watch('remainingCount == 0', function (val) {
        $scope.allChecked = val;
    });

    lcSocket.on('expense:list',function(data) {
        //console.log("got expense:list in ctrl",data);
        //set the current user at the beggining of the data
        if (data.users) {
            var users = data.users
              , exp = []
              , current_user_found = false

            for(var i=0;i<users.length;i++) {
                if (!users[i].user || !users[i].user._id) continue;
                if (current_user == users[i].user._id){
                    users[i].is_current_user = 1
                    exp.unshift(users[i])
                    current_user_found = true;
                }
                else   
                    exp.push(users[i])
            }

            //make sure the current user can get things done
            if (!current_user_found) {
                exp.unshift({
                    user: current_user,
                    items : []
                })
            }

            $scope.expenses = exp;
            expenses = exp;
        }

        $scope.grandTotal = data.total;
    })


    $scope.addExpense = function () {
        var newExpenseTitle = $scope.newExpenseTitle.trim()
          , newExpenseDate = $scope.newExpenseDate.trim()
          , newExpenseValue = $scope.newExpenseValue.trim();
        if (newExpenseTitle.length === 0 
            || newExpenseDate.length === 0
            || newExpenseValue.length === 0) {
            return;
        }
        var expense = {
            title: newExpenseTitle,
            date: newExpenseDate,
            value: newExpenseValue
        };

        if (!expenses[0].items) expenses[0].items = [];
        expenses[0].items.push(expense);
        lcSocket.emit('expense:update',expenses[0].items);

        $scope.newExpenseTitle = '';
        $scope.newExpenseDate = '';
        $scope.newExpenseValue = '';
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
        else lcSocket.emit('expense:update',expenses);
    };

    $scope.revertEditing = function (expense) {
        expenses[expenses.indexOf(expense)] = $scope.originalExpense;
        $scope.doneEditing($scope.originalExpense);
    };

    $scope.removeExpense = function (expense) {
        expenses[0].items.splice(expenses[0].items.indexOf(expense), 1);
        lcSocket.emit('expense:update',expenses[0].items);
    };

});
