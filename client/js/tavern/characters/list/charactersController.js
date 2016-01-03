"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Creature', 'Sex',

		function($scope, $rootScope, $state, errorService, characterService, Creature, Sex) {
			
            $scope.Sex = Sex;
            $scope.characterService = characterService;

            $scope.pullCharacters = function() {
                
                characterService.clear();

                characterService.characters.query({ id: null },

                    function(response) {

                        response.forEach(function(character) {

                            characterService.add(new Creature(character));

                        });

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch characters", error) });

                    });

            };

            $scope.pullCharacters();

        }

	]);			
	
}) (angular.module('CurseApp'));

