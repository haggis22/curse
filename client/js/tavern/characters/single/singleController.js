"use strict";

(function(app) {


	app.controller('tavern.singleController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 'Sex',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature, Sex) {

            $scope.Sex = Sex;
            $scope.characterService = characterService;
			
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

        
        }   // end outer function
	
    ]);			
	
}) (angular.module('CurseApp'));

