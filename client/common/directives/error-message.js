"use strict";

(function (app) {

    app.directive('errorMessage', function () {
        return {
            scope: {
                // we want the error variable to be two-directional
                error: '='
            },
            restrict: 'E',
            replace: true,
            templateUrl: 'common/partials/error-message.html?v=' + (new Date()).getTime(),

            link: function ($scope, $element, $attributes) {

                $element.draggable();

                $scope.close = function () {
                    $scope.error.display = false;
                };

                $scope.$on('raise-error', function (event, args) {

                    $scope.error = args.error;
                    $scope.error.display = true;

                });

            }

        };

    });


})(angular.module('dshell.common'));
	

