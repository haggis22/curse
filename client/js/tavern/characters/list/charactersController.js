"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Creature', 'Sex', 'playerService', '$cookies',

		function($scope, $rootScope, $state, errorService, characterService, Creature, Sex, playerService, $cookies) {
			
            $scope.Sex = Sex;
            $scope.playerService = playerService;

            $scope.pullCharacters = function() {
                
                characterService.characters.query({ id: null },

                    function(response) {

                        response.forEach(function(character) {

                            playerService.addPlayer(new Creature(character));

                        });

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch characters", error) });

                    });

            };

            $scope.pullCharacters();

            $scope.reload = function() {

                $scope.pullCharacters();
            };

        }

	]);			
	
}) (angular.module('CurseApp'));

