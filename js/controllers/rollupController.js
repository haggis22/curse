"use strict";

(function(app) {

	app.controller('rollupController', ['$scope', '$state', 'playerService', 'diceService', 'Sex', 'Item', 'SkillType', 'Skill', 'Weapon', 'Shield', 'Potion', 'skillService',
		function($scope, $state, playerService, diceService, Sex, Item, SkillType, Skill, Weapon, Shield, Potion, skillService) {
			
            $scope.Math = window.Math;
            $scope.skillService = skillService;

            $scope.player = playerService.newPlayer();
            
            playerService.currentPlayer = $scope.player;

            $scope.player.name = 'Zogarth';
            
            // give him some basics to start out
			$scope.player.addItem(new Weapon({ name: 'dirk', damage: { min: 2, max: 3}, skills: [ 'melee' ] }));
            $scope.player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1 }));
            $scope.player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1 }));
            $scope.player.addItem(new Potion({ name: 'healing potion', effects: { type: Potion.prototype.EFFECTS_HEAL, damage: { min: 2, max: 4 } }, amount: 1 }));
            $scope.player.addItem(new Potion({ name: 'antivenom', effects: { type: Potion.prototype.EFFECTS_ANTIVENOM}, amount: 1 }));
			$scope.player.addItem(new Shield({ name: 'buckler', damage: { min: 1, max: 2 } }));

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

