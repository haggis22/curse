"use strict";

(function(app) {

	app.controller('dungeonController', ['$scope', '$state', 'gameService', 'playerService', 'monsterService', 'mapService', 'diceService', 'skillService',
		function($scope, $state, gameService, playerService, monsterService, mapService, diceService, skillService) {
			
			$scope.playerService = playerService;
            $scope.player = playerService.players[0];
			$scope.gameService = gameService;
			$scope.mapService = mapService;
            $scope.skillService = skillService;
			
            if (!playerService.hasPlayers())
			{
				$state.go('rollup');
                return;
			}

			$scope.searchTheRoom = function() {

                for (var m=0; m < $scope.mapService.currentRoom.monsters.length; m++)
                {
                    var monster = $scope.mapService.currentRoom.monsters[m];

                    if (!monster.isAlive())
                    {
                        // put the monster's items in the room
                        for (var i=0; i < monster.pack.length; i++)
                        {
                            $scope.mapService.currentRoom.items.push(monster.pack[i]);
                        }

                        // empty the monster's pack
                        monster.pack.length = 0;
                    }
                
                }  // for loop

				
			};
			
			$scope.isAtPeace = function()
			{
				return $state.current.name == 'dungeon'
			}

			$scope.takeExit = function(exit) {
				
				if ($scope.isAtPeace())
				{
                    $scope.gameService.clearPlays();
				
					$scope.mapService.takeExit(exit);
					
					if ($scope.mapService.currentRoom.hasMonsters())
					{
						$state.go('dungeon.combat');
					}
				
				}
				
				
			};

            $scope.pickUp = function(item) {

                $scope.player.addItem(item);
                
                var remainingItems = [];
                for (var i=0; i < $scope.mapService.currentRoom.items.length; i++)
                {
                    if ($scope.mapService.currentRoom.items[i] != item)
                    {
                        remainingItems.push($scope.mapService.currentRoom.items[i]);
                    }
                }

                $scope.mapService.currentRoom.items = remainingItems;

            };

            $scope.dropItem = function(player, item) {

                var droppedItem = player.dropItem(item);
                if (droppedItem != null)
                {
                    mapService.currentRoom.addItem(droppedItem);
                }

            };

            $scope.transfer = function(item, giver, taker) {

                if (giver.dropItem(item) != null)
                {
                    taker.addItem(item);
                }

            };

            $scope.useItem = function(creature, item) {

                if (item.equipped)
                {
                    creature.unequipItem(item);
                }
                else
                {
                    creature.useItem(item);
                }

            };


		
		}
	]);			
	
}) (angular.module('CurseApp'));




