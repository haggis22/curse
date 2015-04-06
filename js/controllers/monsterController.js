"use strict";

(function(app) {

	app.controller('monsterController', [ '$scope', 'treasureService',

		function($scope, treasureService) {
			
            $scope.attackTypes = 
            [
                { id: 'BITE', desc: 'bite' },
                { id: 'CLAW', desc: 'claw' },
                { id: 'WEAPON', desc: 'weapon' }
            ];

            $scope.skillTypes = 
            [
                { id: 'SkillType.prototype.MELEE', desc: 'Melee' }
            ];

            $scope.bodyShapes = 
            [
                { id: null, desc: 'humanoid' },
                { id: 'BodyShape.prototype.QUADRUPED', desc: 'quadruped' },
                { id: 'BodyShape.prototype.SNAKE', desc: 'snake' },
                { id: 'BodyShape.prototype.WINGED_QUADRUPED', desc: 'winged quadruped' },
                { id: 'BodyShape.prototype.WINGED_HUMANOID', desc: 'winged humanoid' }
            ];

            $scope.sexes = 
            [
                { id: 'Sex.prototype.FEMALE', desc: 'female' },
                { id: 'Sex.prototype.MALE', desc: 'male' },
                { id: null, desc: 'neutral' }
            ];

            $scope.articles = 
            [
                { id: null, desc: 'a' },
                { id: 'an', desc: 'an' },
                { id: '', desc: '[none]' }
            ];


            $scope.reset = function(requireConfirmation) {

                if (requireConfirmation && !confirm("Are you sure you want to clear this monster?"))
                {
                    return;
                }

                $scope.monster = 
                {
                    species: '',
                    bodyShape: $scope.bodyShapes[0],
                    sex: $scope.sexes[2],
                    article: $scope.articles[0],
                    str: { min: 0, max: 0},
                    int: { min: 0, max: 0},
                    dex: { min: 0, max: 0},
                    health: { min: 0, max: 0},
                    frequency: 10,
                    isUndead: false,
                    useWeapons: true,
                    useArmour: true,
                    attacks: [],
                    images: [],
                    numAppearing: { min: 1, max: 1 },
                    treasures: [],
                    skillSet: [ { type: $scope.skillTypes[0], min: 0, max: 0 } ]

                };    

            };

            $scope.reset(false);

            $scope.addAttack = function() {

                $scope.monster.attacks.push({ type: 1, damage: { min: 0, max: 0 }, weaponName: '' });

            };

            $scope.removeAttack = function(attack) {

                var newAttacks = [];
                for (var a=0; a < $scope.monster.attacks.length; a++)
                {
                    if ($scope.monster.attacks[a] != attack)
                    {
                        newAttacks.push($scope.monster.attacks[a]);
                    }
                }

                $scope.monster.attacks = newAttacks;
            };


            $scope.addSkill = function() {

                $scope.monster.skillSet.push({ type: $scope.skillTypes[0], min: 0, max: 0 });

            };

            $scope.removeSkill = function(skill) {

                var newSkills = [];
                for (var s=0; s < $scope.monster.skillSet.length; s++)
                {
                    if ($scope.monster.skillSet[s] != skill)
                    {
                        newSkills.push($scope.monster.skillSet[s]);
                    }
                }

                $scope.monster.skillSet = newSkills;
            };


            $scope.addTreasure = function() {
            
                $scope.monster.treasures.push({ value: "" });

            };

            $scope.removeTreasure = function(treasure) {

                var newTreasures = [];
                for (var t=0; t < $scope.monster.treasures.length; t++)
                {
                    if ($scope.monster.treasures[t] != treasure)
                    {
                        newTreasures.push($scope.monster.treasures[t]);
                    }
                }

                $scope.monster.treasures = newTreasures;
            };

			$scope.getTreasureExamples = function(treasureType)
            {
                if (treasureService.treasures.hasOwnProperty(treasureType))
                {
                    var examples = '';
                    for (var t=0; t < treasureService.treasures[treasureType].length; t++)
                    {
                        var treasure = treasureService.treasures[treasureType][t];
                        examples += (t > 0 ? ', ' : '') + treasure.name;
                    }

                    return examples;
                }

                return null;
            };




		}
	]);
	
}) (angular.module('CurseApp'));
	