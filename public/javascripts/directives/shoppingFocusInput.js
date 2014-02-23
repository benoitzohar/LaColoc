'use strict';

lcangular.directive('shoppingfocusinput', function($timeout) {
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