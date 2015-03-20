"use strict";

(function(app) {

	app.controller('rollupController', ['$scope', '$state', 'playerService', 'diceService', 'Sex', 'Item',
		function($scope, $state, playerService, diceService, Sex, Item) {
			
            $scope.player = playerService.newPlayer();

            $scope.player.name = 'Zogarth';
            
            // give him some basics to start out
			$scope.player.addItem(new Item({ type: Item.prototype.WEAPON, name: 'dirk', damage: 2 }));
            $scope.player.addItem(new Item({ type: Item.prototype.POTION, name: 'healing potion', damage: 3, use: Item.prototype.USE_HEAL }));

            $scope.Sex = Sex;

            $scope.availableSpecies = [ 'dwarf', 'elf', 'hobbit', 'human' ];

			$scope.rollStat = function()
			{
				return diceService.rollDie(3,8) + diceService.rollDie(3,8) + diceService.rollDie(3,8);
			};
			
			$scope.rollCharacter = function(player)
			{
				player.str = $scope.rollStat();
                player.int = $scope.rollStat();
				player.dex = $scope.rollStat();
				player.health = player.maxHealth = $scope.rollStat();
			}
			
			$scope.enterDungeon = function(isValid) {

				$scope.submitted = true;
				
				if (isValid)
				{
					if ($scope.player.health == 0)
					{
						$scope.rollCharacter($scope.player);
					}
					
					$state.go('dungeon');
				}
				
			};
			
		}
	]);			
	
}) (angular.module('CurseApp'));

