"use strict";

(function(app) {


	app.controller('character.editController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 'Sex',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature, Sex) {

            $scope.Sex = Sex;
            $scope.characterService = characterService;
			
            $scope.pullCampaigns();

            $scope.pullCharacter = function(id) {
                
                if (id == null)
                {
                    characterService.current = {};
                    return;
                }                        

                characterService.characters.get({ id: id },

                    function(character) {

                        characterService.current = new Creature(character);

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch character", error) });

                    });

            };

            $scope.pullCharacter($scope.characterID);

            $scope.isNewCharacter = function() {

                return characterService.current == null || characterService.current._id == null;

            };

            $scope.showUpdateSuccess = function() {
                // show the success message for a bit
                $scope.showUpdated = true;
                $timeout(function() { $scope.showUpdated = false; }, 1500);
            };

            $scope.rerollCharacter = function() {

                if (!confirm('Are you sure you want to re-roll this character?'))
                {
                    return;
                }

                characterService.rollup.reroll({ id: characterService.current._id }, 

                    function(result) {
                        
                        // re-fetch the character
                        $scope.pullCharacter(characterService.current._id);
                        $scope.showUpdateSuccess();

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not re-roll character", error) });

                    });
            
            };

            $scope.deleteCharacter = function() {

                if (!confirm('Are you sure you want to delete this character?'))
                {
                    return;
                }

                characterService.characters.delete({ id: characterService.current._id }, 

                    function(result) {
                        
                        // the character no longer exists, so take the back to the list
                        $state.go('tavern.characters.list', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not delete character", error) });

                    });
            
            };


       
        }   // end outer function
	
    ]);			
	
}) (angular.module('CurseApp'));

