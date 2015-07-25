"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Owl',

		function($scope, $rootScope, $state, errorService, characterService, Owl) {
			
            $scope.characters = null;
            
            $scope.pullCharacters = function() {
                
                characterService.characters.query({ id: null },

                    function(response) {

                        $scope.characters = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch characters", error) });

                    });

            };

            $scope.pullCharacters();

            $scope.reload = function() {

                $scope.pullCharacters();
            };

            var owl = new Owl();
            owl.hoot();

        }

	]);			
	
}) (angular.module('CurseApp'));

