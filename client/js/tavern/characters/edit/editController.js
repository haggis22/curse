"use strict";

(function(app) {


	app.controller('tavern.editController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'Creature', 'Stat',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, Creature, Stat) {
			
            $scope.Creature = Creature;
            $scope.Stat = Stat;

            $scope.saveStats = function() {

                characterService.stats.save({ id: characterService.current._id }, characterService.current,

                    function(response) {
                        
                        $scope.showUpdateSuccess();

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not save stats", error) });

                    });

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

                    function(character) {
                        
                        // show the updated character stats
                        characterService.current = character;
                        $scope.showUpdateSuccess();

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not re-roll character", error) });

                    });
            
            };

            $scope.raiseStat = function(stat)
            {
                characterService.current.stats[stat].adjust++;
                characterService.current.bonus.stats--;
            };

            $scope.lowerStat = function(stat)
            {
                characterService.current.stats[stat].adjust--;
                characterService.current.bonus.stats++;
            };

        }

	]);			
	
}) (angular.module('CurseApp'));

