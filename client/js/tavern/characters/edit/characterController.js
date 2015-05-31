"use strict";

(function(app) {


	app.controller('tavern.characterController', ['$scope', '$rootScope', '$state', 'errorService', 'characterService', 'Creature',
		function($scope, $rootScope, $state, errorService, characterService, Creature) {
			
            $scope.isNewCharacter = function() {

                return $scope.characterID == null || $scope.characterID.length == 0;

            };

            $scope.pullCharacter = function() {
                
                if ($scope.isNewCharacter())
                {
                    $scope.character = {};
                    return;
                }                        

                characterService.get({ id: $scope.characterID },

                    function(response) {

                        $scope.character = new Creature(response);

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch character", error) });

                    });

            };

            $scope.pullCharacter();

            $scope.createCharacter = function() {

                characterService.create({}, $scope.character,

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

                characterService.update({ id: $scope.characterID }, $scope.character,

                    function(response) {
                        
                        console.log(response.message);
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

        }

	]);			
	
}) (angular.module('CurseApp'));

