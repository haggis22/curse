"use strict";

(function(app) {

	app.controller('combatController', ['$scope', '$state', 'gameService', 'playerService', 'mapService', 'diceService', 'Sex', 'Action', 'AttackType', 'Attack',
		function($scope, $state, gameService, playerService, mapService, diceService, Sex, Action, AttackType, Attack) {
			
			$scope.playerService = playerService;
			$scope.gameService = gameService;
            $scope.room = mapService.currentRoom;
			
            if (!playerService.hasPlayers())
			{
				$state.go('rollup');
                return;
			}

            $scope.mode = 'action';

			$scope.combatActions = [];

            $scope.viewMonster = function(monster)
            {
                $scope.currentMonster = monster;
            }

            $scope.readyRound = function() {

                if (!$scope.room.hasMonsters())
                {
                    // all monsters have been killed
                    $state.go('dungeon');
                }

                if ($scope.playerService.allDead())
                {
                    // all player characters have been killed
                    $state.go('dungeon');
                }

                $scope.mode = 'action';
                $scope.combatActions.length = 0;

                // if we're not showing a monster, it has died, then pick the first live monster
                if (($scope.currentMonster == null) || (!$scope.currentMonster.isAlive()))
                {
                    $scope.viewMonster($scope.room.liveMonsters()[0]);
                }

            };


            $scope.readyRound();

			
			$scope.fightRound = function() {

                // declare action for each LIVE monster
                var liveMonsters = $scope.room.liveMonsters();

				for (var m=0; m < liveMonsters.length; m++)
				{
					var monster = liveMonsters[m];
                    if (monster.hasSpecialAttacks())
                    {
                        for (var a=0; a < monster.attacks.length; a++)
                        {
                            $scope.addMonsterAttack(monster, $scope.player, monster.attacks[a]);
                        }
                    }
                    else
                    {
                        // monster will attack with its fists / weapon
                        $scope.addAttack(monster, $scope.player);
                    }
				}

                // determine the order of actions by sorting each action's speed in DESCENDING order (higher numbers are better)
                $scope.combatActions.sort(function(a, b) { return b.getSpeed() - a.getSpeed() });

                // sort in DESCENDING order, so higher dex rolls go first
                $scope.combatActions.sort(function(a,b) { return b.speed - a.speed });

				$scope.gameService.clearPlays();

				for (var a=0; a < $scope.combatActions.length; a++)
				{
                    var descriptions = $scope.combatActions[a].perform();

                    // could be empty if no action was taken
                    for (var d=0; d < descriptions.length; d++)
                    {
					    $scope.gameService.addPlay(descriptions[d]);
                    }
				}
				
                $scope.readyRound();                

			};
			

			$scope.clearPlayerAction = function(player) {
			
				var newActions = [];
				for (var a=0; a < $scope.combatActions.length; a++)
				{
					if (!$scope.combatActions[a].getActor() == player)
					{
						newActions.push($scope.combatActions[a]);
					}
				}
				
				$scope.combatActions = newActions;
				
			};
			

            $scope.addAttack = function(attacker, target)
            {
                var weapon = attacker.checkWeapon();
                var weaponName = weapon == null ? 'fist' : weapon.getName();

                var damage = diceService.rollDie(1, Math.max(1, (attacker.str / 5)));
                if (weapon != null)
                {
                    damage += weapon.damage;
                }

                var attack = new Attack({ actor: attacker, type: AttackType.prototype.WEAPON, target: target, damage: damage, weapon: weaponName });
                $scope.combatActions.push(attack);

            };

            $scope.addMonsterAttack = function(monster, target, attack)
            {
                var damage = diceService.rollDie(attack.damage.min, attack.damage.max);

                var attack = new Attack({ actor: monster, type: attack.type, target: target, damage: damage, weapon: attack.weaponName });
                $scope.combatActions.push(attack);

            };


			$scope.chooseAttack = function() {
				
                gameService.clearPlays();

				// clear out anything he might already have decided to do this round
				$scope.clearPlayerAction($scope.player);
				
                // returns an array of live monsters
                var liveMonsters = $scope.room.liveMonsters();

				if (liveMonsters.length == 1)
				{
                    $scope.addAttack($scope.player, liveMonsters[0]);
				}
                else
                {
                    $scope.mode = 'target';
                }
				
			};

            $scope.selectTarget = function(target) {

                if ($scope.mode != 'target')
                {
                    return;
                }

                $scope.addAttack($scope.player, target);

                $scope.mode = 'action';

            }


			$scope.retreat = function() {
				
                // clear any actions the player(s) might have taken
                $scope.combatActions.length = 0;

                // fightRound will set up the monster actions
                $scope.fightRound();

                // if we returned from fightRound then the players are still alive - get them out
                // through a random door
                var exit = $scope.room.randomExit();

				mapService.takeExit(exit);
					
				if ($scope.room.hasMonsters())
				{
					$state.go('dungeon.combat');
				}

                // just take them to the regular choices
                $state.go('dungeon');
				
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

