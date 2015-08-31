"use strict";

(function(app) {


	app.controller('tavern.singleController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 'Sex',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature, Sex) {

            $scope.Sex = Sex;
			
            $scope.pullCharacter = function(id) {
                
                if (id == null)
                {
                    $scope.character = {};
                    return;
                }                        

                characterService.characters.get({ id: id },

                    function(response) {

                        $scope.character = new Creature(response);

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch character", error) });

                    });

            };

            $scope.pullCharacter($scope.characterID);
        
        }   // end outer function
	
    ]);			
	
}) (angular.module('CurseApp'));

