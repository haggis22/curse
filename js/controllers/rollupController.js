"use strict";

(function(app) {

	app.controller('rollupController', ['$scope', '$state', 'playerService', 'diceService', 'Sex', 'Item', 'SkillType', 'Skill', 'Weapon', 'Shield', 'Potion', 'Venom', 'skillService', 'timeService',
		function($scope, $state, playerService, diceService, Sex, Item, SkillType, Skill, Weapon, Shield, Potion, Venom, skillService, timeService) {
			
            $scope.Math = window.Math;
            $scope.skillService = skillService;

            $scope.player = playerService.newPlayer();
            
            playerService.currentPlayer = $scope.player;

            $scope.player.name = 'Zogarth';
            
            $scope.Sex = Sex;

            $scope.availableSpecies = [ 'dwarf', 'elf', 'hobbit', 'human' ];

			$scope.rollStat = function()
			{
				return diceService.rollDie(3,8) + diceService.rollDie(3,8) + diceService.rollDie(3,8);
			};

	
			$scope.rollCharacter = function(player)
			{
                switch (player.species)
                {
                    case 'dwarf':
        				player.str = diceService.rollDie(5, 10) + diceService.rollDie(5, 10) + diceService.rollDie(5,10);
        				player.int = diceService.rollDie(2, 6) + diceService.rollDie(3, 7) + diceService.rollDie(2,7);
        				player.dex = diceService.rollDie(3, 7) + diceService.rollDie(2, 8) + diceService.rollDie(3,7);
                        break;

                    case 'elf':
        				player.str = diceService.rollDie(3, 7) + diceService.rollDie(2, 8) + diceService.rollDie(3,7);
        				player.int = diceService.rollDie(4, 9) + diceService.rollDie(3, 8) + diceService.rollDie(3,8);
        				player.dex = diceService.rollDie(4, 8) + diceService.rollDie(3, 8) + diceService.rollDie(3,9);
                        break;

                    case 'hobbit':
        				player.str = diceService.rollDie(2, 6) + diceService.rollDie(2, 7) + diceService.rollDie(2, 8);
        				player.int = diceService.rollDie(3, 8) + diceService.rollDie(3, 8) + diceService.rollDie(3, 8);
        				player.dex = diceService.rollDie(3, 9) + diceService.rollDie(4, 8) + diceService.rollDie(4, 9);
                        break;

                    default:  // human, et al
        				player.str = diceService.rollDie(3, 8) + diceService.rollDie(3, 8) + diceService.rollDie(3, 8);
        				player.int = diceService.rollDie(3, 8) + diceService.rollDie(3, 8) + diceService.rollDie(3, 8);
        				player.dex = diceService.rollDie(3, 8) + diceService.rollDie(3, 8) + diceService.rollDie(3, 8);
                        break;
                }
				
                player.health = player.maxHealth = $scope.rollStat();
               
                // clear his skills
                player.clearSkills();

                player.adjustSkill("melee", diceService.rollDie(7, 12) + diceService.rollDie(8, 13));
                player.adjustSkill("sword", diceService.rollDie(2, 5) + diceService.rollDie(3, 5));
                player.adjustSkill("magic", diceService.rollDie(7, 12) + diceService.rollDie(8, 13));
                player.adjustSkill("magic", diceService.rollDie(7, 12) + diceService.rollDie(8, 13));
                player.adjustSkill("faith", diceService.rollDie(7, 12) + diceService.rollDie(8, 13));

                player.power = player.maxPower = player.getSkillLevel("magic");

                player.clearSpells();

                player.addKnownSpell('missile');
                player.addKnownSpell('fireball');

                player.curePoison();
                // player.addPoison(new Venom({ chance: 1, damage: { min: 0, max: 1 }, interval: 1200 }), timeService.START_TIME);

                // give him some basics to start out
                player.clearPack();
			    player.addItem(new Weapon({ name: 'dirk of undead slaying', damage: { min: 2, max: 3}, skills: [ 'melee' ], weight: 3, bonus: [ { attr: 'undead', hit: 10, damage: 10 } ] }));
                player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1, weight: 3 }));
                player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1, weight: 3 }));
                player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1, weight: 3 }));
                player.addItem(new Potion({ name: 'antivenom', article: 'an', effects: { type: Potion.prototype.EFFECTS_ANTIVENOM}, amount: 1, weight: 3 }));
			    player.addItem(new Shield({ name: 'buckler', damage: { min: 1, max: 2 }, weight: 8 }));

			};

			
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

