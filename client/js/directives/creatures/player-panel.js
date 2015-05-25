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

                var dropResult = null;

                if ((item.stackable) && (item.stackable.amount > 1))
                {
                    if (item.showAmount)
                    {
                        var amountToDrop = parseInt(item.amountToDrop, 10);
                        amountToDrop = Math.max(0, Math.min(amountToDrop, item.stackable.amount));

                        if (amountToDrop == 0)
                        {
                            // nothing to do here - turn off the drop
                            item.amountToDrop = null;
                            item.showAmount = false;
                            return;
                        }

                        dropResult = player.dropItem(item, amountToDrop);

                        if (dropResult.success)
                        {
                            item.amountToDrop = null;
                            item.showAmount = false;
                            mapService.currentRoom.addItem(dropResult.item);
                        }


                    }
                    else
                    {
                        var amountToDrop = parseInt(item.amountToDrop, 10);

                        if ((isNaN(amountToDrop)) || (amountToDrop > item.stackable.amount) || (amountToDrop < 1))
                        {
                            item.amountToDrop = item.stackable.amount;
                        }

                        item.showAmount = true;
                    }

                    return;
                }

                dropResult = player.dropItem(item);

                if (dropResult.success)
                {
                    item.amountToDrop = null;
                    item.showAmount = false;
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




