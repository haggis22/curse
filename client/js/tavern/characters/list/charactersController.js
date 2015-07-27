"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Creature', 'Sex',

		function($scope, $rootScope, $state, errorService, characterService, Creature, Sex) {
			
            $scope.Sex = Sex;

            $scope.characters = null;
            
            $scope.pullCharacters = function() {
                
                $scope.characters = [];

                characterService.characters.query({ id: null },

                    function(response) {

                        var list = [];
                        response.forEach(function(character) {

                            list.push(new Creature(character));

                        });

                        $scope.characters = list;

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

