/*global lca */
/*jshint unused:false */
(function () {
'use strict';

  lca.directive('datetimez', function() {
      return {
          restrict: 'A',
          require : 'ngModel',
          link: function(scope, element, attrs, ngModel) {
            scope.newExpenseDateObject = new Date().getTime();
            ngModel.$setViewValue(new Date()); //Set default value to datepicker
            
            element.on('changeDate', function(e) {
              var outputDate = new Date(e.date);
              var n = outputDate.getTime();
              scope.newExpenseDateObject = n;
              

              /*scope.$apply(function() {
                console.log('applying ngModel',ngModel,n);
                 ngModel.$setViewValue(n);
                 console.log('ngModel',ngModel);
              });*/
            });
          }
      };
  });

  /**
   * Directive that executes an expression when the element it is applied to gets
   * an `escape` keydown event.
   */
  lca.directive('dEscape', function () {
    var ESCAPE_KEY = 27;
    return function (scope, elem, attrs) {
      elem.bind('keydown', function (event) {
        if (event.keyCode === ESCAPE_KEY) {
          scope.$apply(attrs.dEscape);
        }
      });
    };
  });

  /**
   * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
   */
  lca.directive('dFocus', function ($timeout) {
    return function (scope, elem, attrs) {
      scope.$watch(attrs.dFocus, function (newVal) {
        if (newVal) {
          $timeout(function () {
            elem[0].focus();
          }, 0, false);
        }
      });
    };
  });

  lca.directive('shoppingfocusinput', function($timeout) {
    return {
      restrict :'A',
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          $timeout(function() {
            element.parent().next().find('input')[0].focus();
          });
        });
      }
    };
  });

})();