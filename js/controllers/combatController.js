"use strict";

(function(app) {

	app.controller('combatController', ['$scope', '$state', 'gameService', 'playerService', 'mapService', 'diceService', 'Sex', 'CombatAction',
		function($scope, $state, gameService, playerService, mapService, diceService, Sex, CombatAction) {
			
			$scope.playerService = playerService;
			$scope.gameService = gameService;
			$scope.mapService = mapService;
			
            if (!playerService.hasPlayers())
			{
				$state.go('rollup');
			}
			
			$scope.combatActions = [];
			
			$scope.fightRound = function() {
				
				// declare action for each monster
				for (var m=0; m < $scope.mapService.currentRoom.monsters.length; m++)
				{
					var monster = $scope.mapService.currentRoom.monsters[m];
					$scope.combatActions.push(new CombatAction(CombatAction.prototype.PHYSICAL_ATTACK, monster, $scope.player));
				}

                // TODO: mix up the order that things can happen (i.e., let monsters sometimes attack first)

				$scope.gameService.clearActions();

				for (var a=0; a < $scope.combatActions.length; a++)
				{
					var action = $scope.combatActions[a];
					if (action.isStillRequired())
					{
						switch (action.actionType)
						{
							case CombatAction.prototype.PHYSICAL_ATTACK:
								$scope.attack(action.actor, action.target);
								break;
								
						}  // actionType switch

					}

				}
				
                if (!$scope.mapService.currentRoom.hasMonsters())
                {
                    // all monsters have been killed
                    $state.go('dungeon');
                }

                if ($scope.playerService.allDead())
                {
                    // all player characters have been killed
                    $state.go('dungeon');
                }

				// clear the actions for the next round
				$scope.combatActions.length = 0;
                

			};
			
            $scope.hasMonstersLeft = function()
            {
                for (var m=0; m < $scope.mapService.currentRoom.monsters.length; m++)
                { 
                    if ($scope.mapSerice.currentRoom.monsters[m].health > 0)
                    {
                        return true;
                    }
                }

                return false;
            };


			$scope.clearPlayerAction = function(player) {
			
				var newActions = [];
				for (var a=0; a < $scope.combatActions.length; a++)
				{
					if (!$scope.combatActions[a].isPlayerAction(player))
					{
						newActions.push($scope.combatActions[a]);
					}
				}
				
				$scope.combatActions = newActions;
				
			};
			

			$scope.selectTarget = function() {
				
				// clear out anything he might already have decided to do this round
				$scope.clearPlayerAction($scope.player);
				
				if ($scope.mapService.currentRoom.monsters.length == 1)
				{
					$scope.combatActions.push(new CombatAction(CombatAction.prototype.PHYSICAL_ATTACK, $scope.player, $scope.mapService.currentRoom.monsters[0]));
				}
				
			};


			$scope.retreat = function() {
				
                // clear any actions the player(s) might have taken
                $scope.combatActions.length = 0;

                // fightRound will set up the monster actions
                $scope.fightRound();

                // if we returned from fightRound then the players are still alive - get them out
                // through a random door
                var exit = $scope.mapService.currentRoom.randomExit();

				$scope.mapService.takeExit(exit);
					
				if ($scope.mapService.currentRoom.hasMonsters())
				{
					$state.go('dungeon.combat');
				}

                // just take them to the regular choices
                $state.go('dungeon');
				
			};
			
			
            $scope.attack = function(attacker, target)
            {
				var actions = gameService.actions;
				
				var roll = diceService.rollDie(1,20);
				if (roll < attacker.dex)
				{
					var weapon = attacker.checkWeapon !== undefined ? attacker.checkWeapon() : null;
					
                    // TODO: monsters without fists
                    if (weapon == null)
					{
						weapon = 
						{
							name: 'fist',
							damage: 0
						};
					}
			
					var damage = Math.floor(Math.random() * attacker.str / 5) + 1;
					if (weapon.damage != null)
					{
						damage += weapon.damage;
					}

                    var bodyPart = diceService.randomElement(target.bodyShape.parts);

                    damage = Math.round(damage * bodyPart.damageFactor);

					actions.push(attacker.getName(true) + ' hit ' + target.getName(true) + ' in the ' + bodyPart.name + ' with ' + attacker.getPossessive() + ' ' + weapon.name  + ' for ' + damage + ' damage!');
					
					var armour = target.checkArmour !== undefined ? target.checkArmour(bodyPart.name) : null;

					if (armour != null)
					{
						var absorbed = Math.min(damage, armour.damage);
						
						actions.push(target.getPossessive() + ' ' + armour.name + ' absorbed ' + absorbed + ' of the damage');
						damage = Math.max(damage - absorbed, 0);
					}
			
					// Math.max will ensure the health can't go below zero. Negative health would just look weird
					target.health = Math.max(0, target.health - damage);
					
					if (target.health == 0)
					{
						actions.push(attacker.getName(true) + ' killed ' + target.getName(true) + '!');
					}
					
				}
				else
				{
					actions.push(attacker.getName(true) + ' attacked ' + target.getName(true) + ' but missed...');
				}
				
				
			};
			
		
			$scope.determineBodyPart = function(bodyShape)
			{
				var roll = Math.random();
				if (roll < 0.20)
				{
					return 'head';
				}
				if (roll < 0.70)
				{
					return 'torso';
				}
				if (roll < 0.80)
				{
					return 'arm';
				}
				if (roll < 0.85)
				{
					return 'groin';
				}
				if (roll < 0.9)
				{
					return 'butt';
				}
			
				return 'leg';
			}
		
		
		
		}
	]);			
	
}) (angular.module('CurseApp'));

