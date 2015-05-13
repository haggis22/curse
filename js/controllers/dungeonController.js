"use strict";

(function(app) {

	app.controller('dungeonController', ['$scope', '$state', 'gameService', 'playerService', 'monsterService', 'mapService', 'diceService', 'timeService',
		function($scope, $state, gameService, playerService, monsterService, mapService, diceService, timeService) {
			
			$scope.playerService = playerService;
			$scope.gameService = gameService;
			$scope.mapService = mapService;
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
                    for (var i=0; i < mapService.currentRoom.items.length; i++)
                    {
                        if (mapService.currentRoom.items[i] != item)
                        {
                            remainingItems.push(mapService.currentRoom.items[i]);
                        }
                    }

                    mapService.currentRoom.items = remainingItems;
                }
                else
                {
                    gameService.addPlay(results.message);
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


		}

	]);			
	
}) (angular.module('CurseApp'));




