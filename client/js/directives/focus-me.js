"use strict";

(function (app) {

    app.directive('focusMe', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function (value) {
                    if (value === true) {
                        // the timeout will give any container time to appear
                        $timeout(function() {
                            
                            element[0].select();
                            element[0].focus();

                        }, 200);
                    }
                });
            }
        };
    });

})(angular.module('CurseApp'));
	

