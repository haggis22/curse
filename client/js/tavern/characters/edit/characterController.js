"use strict";

(function(app) {


	app.controller('tavern.characterController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'Creature',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, Creature) {
			
            $scope.availableSpecies = [ 'dwarf', 'elf', 'hobbit', 'human' ];

            $scope.isNewCharacter = function() {

                return $scope.character == null || $scope.character._id == null;

            };

            $scope.gotoTab = function(tabName) 
            {
                $scope.showTab = tabName;
            };

            $scope.gotoTab('stats');

            $scope.pullCharacter = function() {
                
                $scope.statsAdjust = { str: 0, int: 0, dex: 0 };

                if ($scope.characterID == null)
                {
                    $scope.character = {};
                    return;
                }                        

                characterService.characters.get({ id: $scope.characterID },

                    function(response) {

                        $scope.character = new Creature(response);

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

//                        $state.go('tavern.characters', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create character", error) });

                    });

            };

            $scope.updateCharacter = function() {

                characterService.characters.update({ id: $scope.characterID }, $scope.character,

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

            $scope.statArray = [
                { prop: 'str', name: 'Strength' },
                { prop: 'int', name: 'Intelligence' },
                { prop: 'dex', name: 'Dexterity' }
            ];

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

