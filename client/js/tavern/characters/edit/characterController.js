"use strict";

(function(app) {


	app.controller('tavern.characterController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature) {
			
            $scope.Creature = Creature;

            $scope.availableSpecies = [ 'dwarf', 'elf', 'hobbit', 'human' ];

            $scope.statArray = [
                { prop: 'str', name: 'Strength' },
                { prop: 'int', name: 'Intelligence' },
                { prop: 'dex', name: 'Dexterity' },
                { prop: 'pie', name: 'Piety' }
            ];

            $scope.availableSkills = null;

            $scope.pullSkills = function() {

                skillService.query({}, 
                    function(response) {

                        $scope.availableSkills = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch skills", error) });

                    });

            };

            $scope.pullSkills();


            $scope.isNewCharacter = function() {

                return $scope.characterID == null || $scope.characterID == '';

            };

            $scope.gotoTab = function(tabName) 
            {
                $scope.showTab = tabName;
            };

            $scope.gotoTab('stats');

            $scope.pullCharacter = function() {
                
                if (($scope.characterID == null) || ($scope.characterID == ''))
                {
                    $scope.character = {};
                    return;
                }                        

                characterService.characters.get({ id: $scope.characterID },

                    function(response) {

                        // $scope.character = new Creature(response);
                        $scope.character = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch character", error) });

                    });

            };

            $scope.pullCharacter();

            $scope.createCharacter = function() {

                characterService.characters.create({}, $scope.character,

                    function(response) {
                        
                        console.log('Create character response = ' + response);
                        $scope.character = response.character;
                        $scope.characterID = response.character._id;

//                        $state.go('tavern.characters', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create character", error) });

                    });

            };

            $scope.updateCharacter = function() {

                var request =
                {
                    character: $scope.character
                };

                characterService.characters.update({ id: $scope.characterID }, request,

                    function(response) {
                        
                        $state.go('tavern.characters', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not update character", error) });

                    });

            };

            $scope.saveCharacter = function(isValid) {

                $scope.submitted = true;
            
                if (!isValid)
                {
                    return;
                }

                if ($scope.isNewCharacter())
                {
                    $scope.createCharacter();
                }
                else
                {
                    $scope.updateCharacter();
                }

            }

            $scope.rerollCharacter = function() {

                if (!confirm('Are you sure you want to re-roll this character?'))
                {
                    return;
                }

                characterService.rollup.reroll({ id: $scope.characterID }, 

                    function(response) {
                        
                        // show the updated character stats
                        $scope.character = response;

                        // show the success message for a bit
                        $scope.showUpdated = true;
                        $timeout(function() { $scope.showUpdated = false; }, 2000);

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not re-roll character", error) });

                    });
            
            };

            $scope.getStatValue = function(mapName, key)
            {
                if ($scope.character == null || !$scope.character.hasOwnProperty(mapName) || !$scope.character[mapName].hasOwnProperty(key))
                {
                    return null;
                }

                return $scope.character[mapName][key].value + $scope.character[mapName][key].adjust;
            };

            $scope.raiseStat = function(stat)
            {
                $scope.character.stats[stat].adjust++;
                $scope.character.bonus.stats--;
            };

            $scope.lowerStat = function(stat)
            {
                $scope.character.stats[stat].adjust--;
                $scope.character.bonus.stats++;
            };

            $scope.hasAnySkills = function()
            {
                if ($scope.character == null)
                {
                    return false;
                }

                for (var prop in $scope.character.skills)
                {
                    if ($scope.character.skills.hasOwnProperty(prop))
                    {
                        return true;
                    }
                }

                return false;
            };

            // if the character is short of the necessary value in any of
            // the skill minimums, then he can't acquire this skill yet
            $scope.skillEligible = function(skill) 
            {
                if (($scope.character == null) || (skill == null))
                {
                    return false;
                }

                if (!skill.minimums)
                {
                    // no minimum stats required
                    return true;
                }
                
                if (!$scope.character.stats)
                {
                    return false;
                }

                for (var prop in skill.minimums)
                {
                    if (skill.minimums.hasOwnProperty(prop))
                    {
                        if (!$scope.character.stats.hasOwnProperty(prop))
                        {
                            return false;
                        }

                        if ($scope.getStatValue('stats', prop) < parseInt(skill.minimums[prop], 10))
                        {
                            return false;
                        }
                    }
                }

                return true;
            };

            $scope.addSkill = function(skill) {

                $scope.skillError = null;

                if (!$scope.skillEligible(skill))
                {
                    $scope.skillError = "You are not eligible for the " + skill.name + " skill.";
                    return;
                }

                if ($scope.character.bonus.skills < 1)
                {
                    $scope.skillError = "You have no skill points to allocate.";
                    return;
                }

                var mySkill = 
                {
                    name: skill.name,
                    value: 1,
                    max: 1,
                    adjust: 0
                };

                // take a point from his skills allocation
                $scope.character.bonus.skills--;

                $scope.character.skills[skill.name] = mySkill;


            };


            $scope.raiseSkill = function(skillName)
            {
                $scope.character.skills[skillName].adjust++;
                $scope.character.bonus.skills--;
            };

            $scope.lowerSkill = function(skillName)
            {
                $scope.character.skills[skillName].adjust--;
                $scope.character.bonus.skills++;
            };

        }

	]);			
	
}) (angular.module('CurseApp'));

