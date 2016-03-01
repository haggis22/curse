"use strict";

(function(app) {


    app.controller('dungeon.character.gearController', ['$scope', '$rootScope', '$state', 'errorService', 'dungeonService', 
		function($scope, $rootScope, $state, errorService, dungeonService) {

            $scope.getTotalWeight = function() {

                var weight = 0;

                for (var i = 0; i < $scope.pack.length; i++) {
                    weight += $scope.pack[i].getWeight();
                }

                return weight;

            };

            $scope.dropItem = function(item) {

                console.debug('campaignID: ' + dungeonService.campaignID + ', characterID: + ' + dungeonService.character._id + ', itemID: ' + item._id + ' == ' + dungeonService.character.getName(false) + ' drops ' + item.getName(true));

                dungeonService.drop.drop({ campaignID: dungeonService.campaignID, characterID: dungeonService.character._id, itemID: item._id },

                    function(result) {

                        if (result.success)
                        {
                            return $rootScope.$broadcast('refresh-dungeon');
                        }
                        else
                        {
                            $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not drop " + item.getName(true), result.message ) });
                        }

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not drop " + item.getName(true), error) });

                    });

            };  // dropItem


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

