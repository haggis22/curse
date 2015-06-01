"use strict";

(function(app) {


	app.controller('tavern.characterController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'Creature',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, Creature) {
			
            $scope.availableSpecies = [ 'dwarf', 'elf', 'hobbit', 'human' ];

            $scope.isNewCharacter = function() {

                return $scope.characterID == null || $scope.characterID.length == 0;

            };

            $scope.pullCharacter = function() {
                
                if ($scope.isNewCharacter())
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
                        
                        console.log(response.message);
                        $state.go('tavern.characters', {}, { reload: true });

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

        }

	]);			
	
}) (angular.module('CurseApp'));

