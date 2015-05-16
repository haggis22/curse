"use strict";

(function(app) {

	app.controller('combatController', ['$scope', '$state', 'gameService', 'playerService', 'mapService', 'diceService', 'timeService', 'Sex', 'Action', 'Attack', 'WeaponAttack', 'SpecialAttack', 'spellService', 'skillService', 'Spell', 'Weapon',
		function($scope, $state, gameService, playerService, mapService, diceService, timeService, Sex, Action, Attack, WeaponAttack, SpecialAttack, spellService, skillService, Spell, Weapon) {
			
			$scope.playerService = playerService;
			$scope.gameService = gameService;
            $scope.room = mapService.currentRoom;
            $scope.spellService = spellService;
            $scope.skillService = skillService;
			
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

                timeService.addRounds(1);

                // declare action for each LIVE monster
                var liveMonsters = $scope.room.liveMonsters();

				for (var m=0; m < liveMonsters.length; m++)
				{
					var monster = liveMonsters[m];

                    // each player will use all its attacks on a single, random player
                    var target = playerService.randomLivingPlayer();
                    if (target != null)
                    {

                        if (monster.hasSpecialAttacks())
                        {
                            for (var a=0; a < monster.attacks.length; a++)
                            {
                                if (monster.attacks[a].isSpecialAttack)
                                {
                                    $scope.addSpecialAttack(monster, target, monster.attacks[a]);
                                }
                                else
                                {
                                    $scope.addMonsterAttack(monster, target, monster.attacks[a]);
                                }
                            }
                        }
                        else
                        {
                            // monster will attack with its fists / weapon
                            $scope.addAttack(monster, target);
                        }

                    }
				}

                // determine the order of actions by sorting each action's speed in DESCENDING order (higher numbers are better)
                $scope.combatActions.sort(function(a, b) { return b.speed - a.speed });

                // sort in DESCENDING order - the higher the speed, the faster the action
                $scope.combatActions.sort(function(a,b) { return b.speed - a.speed });

				$scope.gameService.clearPlays();

				for (var a=0; a < $scope.combatActions.length; a++)
				{
                    var result = $scope.combatActions[a].perform(timeService.date);

                    // could be empty if no action was taken
                    for (var d=0; d < result.messages.length; d++)
                    {
					    $scope.gameService.addPlay(result.messages[d]);
                    }
				}
				
                $scope.readyRound();                

			};
			

			$scope.clearPlayerAction = function(player) {
			
				var newActions = [];
				for (var a=0; a < $scope.combatActions.length; a++)
				{
					if ($scope.combatActions[a].actor != player)
					{
						newActions.push($scope.combatActions[a]);
					}
				}
				
				$scope.combatActions = newActions;
				
			};
			

            $scope.addAttack = function(attacker, target)
            {
                var weapon = attacker.checkWeapon();
                if (weapon == null)
                {
                    weapon = new Weapon({ name: 'fist', article: 'a', damage: { min: 1, max: attacker.str / 5 }, skills: [ 'melee' ] });
                }

                var attack = new Attack({ actor: attacker, target: target, type: new WeaponAttack({ weapon: weapon }) });
                $scope.combatActions.push(attack);

            };

            $scope.addMonsterAttack = function(monster, target, type)
            {
                var attack = new Attack({ actor: monster, target: target, type: type });
                $scope.combatActions.push(attack);
            };

            $scope.addSpecialAttack = function(attacker, target, type)
            {
                var attack = new SpecialAttack({ actor: attacker, target: target, type: type });
                $scope.combatActions.push(attack);
            };

            $scope.addSpell = function(spell)
            {
                $scope.combatActions.push(spell);
            };


			$scope.chooseAttack = function() {
				
                gameService.clearPlays();

				// clear out anything he might already have decided to do this round
				$scope.clearPlayerAction(playerService.currentPlayer);
				
                if (!playerService.currentPlayer.isActive())
                {
                    return;
                }

                // returns an array of live monsters
                var liveMonsters = $scope.room.liveMonsters();

				if (liveMonsters.length == 1)
				{
                    $scope.addAttack(playerService.currentPlayer, liveMonsters[0]);
				}
                else
                {
                    $scope.mode = 'attack-target';
                }
				
			};

			$scope.chooseSpell = function() {
				
                gameService.clearPlays();

				// clear out anything he might already have decided to do this round
				$scope.clearPlayerAction(playerService.currentPlayer);

                if (!playerService.currentPlayer.isActive())
                {
                    // incapacitated players can't do anything
                    return;
                }
				
                $scope.mode = 'spell-chant';
				
			};


            $scope.castSpell = function() {

                $scope.spellType = spellService.getSpell($scope.spellName);
                if ($scope.spellType == null)
                {
                    $scope.mode = 'action';
                    return;
                }

                if ($scope.spellType.isTargeted())
                {
                    $scope.mode = 'spell-target';
                }
                else
                {
                    $scope.addSpell(new Spell({ actor: playerService.currentPlayer, spellType: $scope.spellType }));
                    $scope.mode = 'action';
                }

            };

            $scope.cancelTarget = function() {
                $scope.mode = 'action';
            };

            $scope.cancelSpell = function() {
                $scope.mode = 'action';
            };

            $scope.inTargetMode = function()
            {
                return $scope.mode == 'attack-target' || $scope.mode == 'spell-target';
            }

            $scope.selectTarget = function(target) {

                if ($scope.mode == 'attack-target')
                {
                    $scope.addAttack(playerService.currentPlayer, target);
                    $scope.mode = 'action';
                }

                if ($scope.mode == 'spell-target')
                {
                    $scope.addSpell(new Spell({ actor: playerService.currentPlayer, spellType: $scope.spellType, target: target }));
                    $scope.mode = 'action';
                }

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

