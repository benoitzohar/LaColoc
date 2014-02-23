'use strict';

lcangular.directive('datetimez', function() {
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