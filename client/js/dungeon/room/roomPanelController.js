"use strict";

(function(app) {


	app.controller('dungeon.roomPanelController', ['$scope', '$rootScope', '$state', 'errorService', 'dungeonService', 

		function($scope, $rootScope, $state, errorService, dungeonService) {

            $scope.dungeonService = dungeonService;


            $scope.takeExit = function(exit) {

                if (!exit)
                {
                    return;
                }

                dungeonService.exit.take({ campaignID: $scope.campaignID, exitID: exit._id },

                    function(result) {

                        if (result.success)
                        {

                            if (result.room == 'tavern')
                            {
                                // there is no dungeon, so take the user back to the tavern
                                return $state.go('tavern.campaigns');
                            }

                            return $rootScope.$broadcast('refresh-dungeon');

                        }
                        else
                        {
                            $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not take exit", error) });
                        }

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not take exit", error) });

                    });

            };  // takeExit

            $scope.pickUp = function(item) {

                console.debug('campaignID: ' + $scope.campaignID + ', characterID: + ' + dungeonService.character._id + ', itemID: ' + item._id + ' == ' + dungeonService.character.getName(false) + ' picks up ' + item.getName(true));

                dungeonService.take.take({ campaignID: $scope.campaignID, characterID: dungeonService.character._id, itemID: item._id },

                    function(result) {

                        if (result.success)
                        {
                            return $rootScope.$broadcast('refresh-dungeon');
                        }
                        else
                        {
                            $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not pick up " + item.getName(true), result.message ) });
                        }

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not pick up " + item.getName(true), error) });

                    });

            };  // pickUp


        }  // outer function

	]);	
    
	app.directive('roomPanel', [
    
        function() {

            return {

                restrict: 'E',
//                scope: { player: '=' },
                templateUrl: '/js/dungeon/room/room-panel.html?v=' + (new Date()).getTime(),
                controller: 'dungeon.roomPanelController',
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);
    		
	
}) (angular.module('CurseApp'));

