"use strict";

(function(app) {

	app.controller('dungeonController', ['$scope', '$state', 'gameService', 'playerService', 'monsterService', 'mapService', 'diceService', 'skillService', 'timeService',
		function($scope, $state, gameService, playerService, monsterService, mapService, diceService, skillService, timeService) {
			
			$scope.playerService = playerService;
            $scope.player = playerService.players[0];
			$scope.gameService = gameService;
			$scope.mapService = mapService;
            $scope.skillService = skillService;
            $scope.timeService = timeService;
			
            if (!playerService.hasPlayers())
			{
				$state.go('rollup');
                return;
			}

			
			$scope.isAtPeace = function()
			{
				return $state.current.name == 'dungeon'
			}

			$scope.takeExit = function(exit) {
				
				if ($scope.isAtPeace())
				{
                    timeService.addTurns(1);

                    $scope.gameService.clearPlays();
				
					$scope.mapService.takeExit(exit);
					
					if ($scope.mapService.currentRoom.hasMonsters())
					{
						$state.go('dungeon.combat');
					}
				
				}
				
				
			};

            $scope.pickUp = function(item) {

                var results = $scope.player.addItem(item);

                if (results.success)
                {
                    var remainingItems = [];
                    for (var i=0; i < $scope.mapService.currentRoom.items.length; i++)
                    {
                        if ($scope.mapService.currentRoom.items[i] != item)
                        {
                            remainingItems.push($scope.mapService.currentRoom.items[i]);
                        }
                    }

                    $scope.mapService.currentRoom.items = remainingItems;
                }
                else
                {
                    gameService.addPlay(results.message);
                }

            };

            $scope.dropItem = function(player, item) {

                var dropResult = player.dropItem(item);

                if (dropResult.success)
                {
                    mapService.currentRoom.addItem(dropResult.item);
                }

            };

            $scope.transfer = function(item, giver, taker) {

                var dropResult = giver.dropItem(item);

                if (dropResult.success)
                {
                    var addResult = taker.addItem(item);
                    if (!addResult.success)
                    {
                        gameService.addPlay(addResult.message);

                        // just put it in the room instead
                        mapService.currentRoom.addItem(dropResult.item);

                    }

                }
                else
                {
                    gameService.addPlay(dropResult.message);
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




