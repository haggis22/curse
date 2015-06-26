"use strict";

(function(app) {


	app.controller('tavern.singleController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature) {
			
            $scope.pullCharacter = function() {
                
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
        
        }   // end outer function
	
    ]);			
	
}) (angular.module('CurseApp'));

