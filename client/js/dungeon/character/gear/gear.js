"use strict";

(function(app) {


    app.controller('dungeon.character.gearController', ['$scope', '$rootScope', '$state', 'errorService', 'shoppeService', 
		function($scope, $rootScope, $state, errorService, shoppeService) {

            $scope.getTotalWeight = function() {

                var weight = 0;

                for (var i = 0; i < $scope.pack.length; i++) {
                    weight += $scope.pack[i].getWeight();
                }

                return weight;

            };


        }   // end controller function

	]);			

	app.directive('characterGear', function() {

        return {

            scope: 
            {
                pack: '='
            },
            restrict: 'E',
            replace: true,
            templateUrl: '/js/dungeon/character/gear/gear.html?v=' + (new Date()).getTime(),
            controller: 'dungeon.character.gearController'
        
        };


    });

	
}) (angular.module('CurseApp'));

