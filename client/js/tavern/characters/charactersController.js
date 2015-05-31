"use strict";

(function(app) {


	app.controller('tavern.charactersController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService',
		function($scope, $rootScope, $state, errorService, characterService) {
			
            $scope.characters = null;
            
            $scope.pullCharacters = function() {
                
                characterService.query({ id: null },

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

        }

	]);			
	
}) (angular.module('CurseApp'));

