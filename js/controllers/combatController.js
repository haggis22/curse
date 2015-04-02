"use strict";

(function(app) {

	app.controller('combatController', ['$scope', '$state', 'gameService', 'playerService', 'mapService', 'diceService', 'Sex', 'CombatAction', 'Attack', 'SkillType',
		function($scope, $state, gameService, playerService, mapService, diceService, Sex, CombatAction, Attack, SkillType) {
			
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

                // declare action for each monster
				for (var m=0; m < $scope.room.monsters.length; m++)
				{
					var monster = $scope.room.monsters[m];
					$scope.combatActions.push(new CombatAction(CombatAction.prototype.PHYSICAL_ATTACK, monster, $scope.player));
				}

                // determine the order of attack, based on the character's dexterity, adjusted by any skills relevant to 
                // the attack
                for (var a=0; a < $scope.combatActions.length; a++)
                {
                    var action = $scope.combatActions[a];

                    var msg = "Attack Speed, attacker: " + action.attacker.getName(null) + ", dex: " + action.attacker.dex;

                    var attackerSpeed = action.attacker.dex;
                    
                    var relevantSkills = action.getRelevantSkills();
                    for (var s=0; s < relevantSkills.length; s++)
                    {
                        var skillType = SkillType.prototype.getSkillType(relevantSkills[s]);
                        msg += ", " + skillType.getName() + ": " + action.attacker.getSkillLevel(relevantSkills[s]);
                        attackerSpeed += action.attacker.getSkillLevel(relevantSkills[s]);
                    }

                    action.speed = diceService.averageDie(0, attackerSpeed);
                    msg += ", TOTAL: " + attackerSpeed + ", Roll: " + action.speed;
                    console.info(msg);
                }

                // sort in DESCENDING order, so higher dex rolls go first
                $scope.combatActions.sort(function(a,b) { return b.speed - a.speed });

				$scope.gameService.clearActions();

				for (var a=0; a < $scope.combatActions.length; a++)
				{
					var action = $scope.combatActions[a];
					if (action.isStillRequired())
					{
						switch (action.actionType)
						{
							case CombatAction.prototype.PHYSICAL_ATTACK:
								$scope.attack(action.attacker, action.target);
								break;
								
						}  // actionType switch

					}

				}
				
                $scope.readyRound();                

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
			

			$scope.chooseAction = function() {
				
                gameService.clearActions();

				// clear out anything he might already have decided to do this round
				$scope.clearPlayerAction($scope.player);
				
                // returns an array of live monsters
                var liveMonsters = $scope.room.liveMonsters();

				if (liveMonsters.length == 1)
				{
					$scope.combatActions.push(new CombatAction(CombatAction.prototype.PHYSICAL_ATTACK, $scope.player, liveMonsters[0]));
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

				$scope.combatActions.push(new CombatAction(CombatAction.prototype.PHYSICAL_ATTACK, $scope.player, target));
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
			
			
            $scope.attack = function(attacker, target)
            {
				var actions = gameService.actions;

                var toHit = 50 + attacker.dex - target.dex + attacker.getSkillLevel(SkillType.prototype.ID_MELEE) - target.getSkillLevel(SkillType.prototype.ID_MELEE);
				var roll = diceService.rollDie(1, 100);
                console.log('attacker: ' + attacker.getName(null) + ', target: ' + target.getName(null) + ', toHit: ' + toHit + ', roll: ' + roll);
				if (roll <= toHit)
				{
                    var myAttack = new Attack({ type: Attack.prototype.WEAPON, damage: Math.floor(Math.random() * attacker.str / 5) + 1, weapon: 'fist' });

                    if ((attacker.attacks != null) && (attacker.attacks.length > 0))
                    {
                        myAttack = attacker.attacks[0];
                    }
                    else
                    {
    					var weapon = typeof attacker.checkWeapon === 'function' ? attacker.checkWeapon() : null;
                        if (weapon != null)
                        {
                            myAttack.weapon = weapon.name;
                            if (weapon.damage != null)
                            {
                                myAttack.damage += weapon.damage;
                            }
                        }
                    }

                    var bodyPart = diceService.randomElement(target.bodyShape.parts);

                    var damage = Math.round(myAttack.damage * bodyPart.damageFactor);

                    actions.push(myAttack.getDescription(attacker, target, bodyPart, damage));
					
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
						actions.push(attacker.getName(true) + (target.isUndead ? ' destroyed ' : ' killed ') + target.getName(true) + '!');
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

