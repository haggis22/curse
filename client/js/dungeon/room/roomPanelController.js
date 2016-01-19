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

                        if (result)
                        {
                            $rootScope.$broadcast('refresh-dungeon');
                        }

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not take exit", error) });

                    });

            };  // takeExit

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

