"use strict";

(function(app) {

	app.controller('dungeonController', ['$scope', '$state', 'gameService', 'playerService', 'monsterService', 'mapService', 'diceService', 'timeService', 'Item',
		function($scope, $state, gameService, playerService, monsterService, mapService, diceService, timeService, Item) {
			
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
                
                var results = null;

                if ((item.stackable) && (item.stackable.amount > 1))
                {
                    if (item.showAmount)
                    {
                        var amountToPickUp = parseInt(item.amountToPickUp, 10);
                        amountToPickUp = Math.max(0, Math.min(amountToPickUp, item.stackable.amount));

                        if (amountToPickUp == 0)
                        {
                            // nothing to do here - turn off the pickup
                            item.amountToPickUp = null;
                            item.showAmount = false;
                            return;
                        }

                        var takenItem = new Item(item);
                        takenItem.stackable.amount = amountToPickUp;

                        results = playerService.currentPlayer.addItem(takenItem);

                        if (results.success)
                        {
                            var remainingItems = [];
                            for (var i=0; i < mapService.currentRoom.items.length; i++)
                            {
                                var roomItem = mapService.currentRoom.items[i];
                                if (roomItem == item)
                                {
                                    // reduce the item's amount by the amount taken
                                    roomItem.stackable.amount -= takenItem.stackable.amount;
                                    
                                    // stop showing the amount
                                    roomItem.showAmount = false;
                                }

                                if (roomItem.stackable.amount > 0)
                                {
                                    remainingItems.push(roomItem);
                                }

                            }

                            mapService.currentRoom.items = remainingItems;
                        }
                        else
                        {
                            gameService.addPlay(results.message);
                        }

                    }
                    else
                    {
                        var amountToPickUp = parseInt(item.amountToPickUp, 10);

                        if ((isNaN(amountToPickUp)) || (amountToPickUp > item.stackable.amount) || (amountToPickUp < 1))
                        {
                            item.amountToPickUp = item.stackable.amount;
                        }

                        item.showAmount = true;
                    }

                    return;
                }

                results = playerService.currentPlayer.addItem(item);

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

                var results = null;

                if ((item.stackable) && (item.stackable.amount > 1))
                {
                    if (item.showAmount)
                    {
                        var amountToTake = parseInt(item.amountToTake, 10);
                        amountToTake = Math.max(0, Math.min(amountToTake, item.stackable.amount));

                        if (amountToTake == 0)
                        {
                            // nothing to do here - turn off the pickup
                            item.amountToTake = null;
                            item.showAmount = false;
                            return;
                        }

                        results = giver.dropItem(item, amountToTake);

                        if (!results.success)
                        {
                            // the giver could not give it up, so turn off the pickup
                            item.showAMount = false;
                            gameService.addPlay(results.message);
                        }

                        // the giver has dropped it, now try to add it to the taker
                        results = taker.addItem(results.item);

                        if (results.success)
                        {
                            // added successfully, so stop showing the dialog
                            item.amountToTake = null;
                            item.showAmount = false;
                        }
                        else
                        {
                            gameService.addPlay(results.message);

                            // just put it in the room instead
                            mapService.currentRoom.addItem(dropResult.item);

                        }

                    }
                    else
                    {
                        var amountToTake = parseInt(item.amountToTake, 10);

                        if ((isNaN(amountToTake)) || (amountToTake > item.stackable.amount) || (amountToTake < 1))
                        {
                            item.amountToTake = item.stackable.amount;
                        }

                        item.showAmount = true;
                    }

                    return;
                }

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




