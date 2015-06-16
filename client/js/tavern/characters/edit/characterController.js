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

            $scope.skills = null;

            $scope.pullSkills = function() {

                skillService.query({}, 
                    function(response) {

                        $scope.skills = response;

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
                
                $scope.statsAdjust = {};
                
                $scope.statArray.forEach(function(stat) {
                    $scope.statsAdjust[stat.prop] = 0;
                });

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
                    character: $scope.character,
                    adjustment: $scope.statsAdjust
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


            $scope.raiseStat = function(stat)
            {
                if ($scope.character.stats.bonus > 0)
                {
                    $scope.statsAdjust[stat]++;
                    $scope.character.stats.bonus--;
                }

            };

            $scope.lowerStat = function(stat)
            {
                if ($scope.statsAdjust[stat] > 0)
                {
                    $scope.statsAdjust[stat]--;
                    $scope.character.stats.bonus++;
                }

            }

        }

	]);			
	
}) (angular.module('CurseApp'));

