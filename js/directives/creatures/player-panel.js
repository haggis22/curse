"use strict";

(function(app) {

	app.directive('playerPanel', ['skillService', 
    
        function(skillService) {

            return {

                restrict: 'E',
                scope: { player: '=' },
                templateUrl: '/partials/creatures/player-panel.html?v=' + (new Date()).getTime(),
                controller: 'playerPanelController',
                link: function($scope, $element, $attrs)  {

                }

            };

        }
    
    ]);

    app.controller('playerPanelController', ['$scope', 'skillService', 'mapService', 'gameService',

        function($scope, skillService, mapService, gameService)
        {
            $scope.skillService = skillService;

            $scope.dropItem = function(player, item) {

                var dropResult = player.dropItem(item);

                if (dropResult.success)
                {
                    mapService.currentRoom.addItem(dropResult.item);
                }

            };

            $scope.useItem = function(creature, item) {

                var result = {};

                if (item.equipped)
                {
                    result = creature.unequipItem(item);
                }
                else
                {
                    result = creature.useItem(item);
                }

                if (result.message)
                {
                    gameService.addPlay(result.message);
                }

            };

        }

    ]);
	
}) (angular.module('CurseApp'));




