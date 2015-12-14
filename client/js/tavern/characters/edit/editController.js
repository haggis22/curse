"use strict";

(function(app) {


	app.controller('tavern.editController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'skillService', 'Creature', 'Sex', 'Stat',
		function($scope, $rootScope, $state, $timeout, errorService, characterService, skillService, Creature, Sex, Stat) {
			
            $scope.Creature = Creature;
            $scope.Stat = Stat;

            $scope.saveStats = function() {

                characterService.stats.save({ id: characterService.current._id }, characterService.current,

                    function(response) {
                        
                        // $state.go('tavern.characters', {}, { reload: true });
                        console.log('saveStats succeeded');

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not save stats", error) });

                    });

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

                        // show the success message for a bit
                        $scope.showUpdated = true;
                        $timeout(function() { $scope.showUpdated = false; }, 2000);

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not re-roll character", error) });

                    });
            
            };

            $scope.getStatValue = function(mapName, key)
            {
                if (characterService.current == null || !characterService.current.hasOwnProperty(mapName) || !characterService.current[mapName].hasOwnProperty(key))
                {
                    return 0;
                }

                return characterService.current[mapName][key].value + characterService.current[mapName][key].adjust;
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

