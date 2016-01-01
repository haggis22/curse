"use strict";

(function(app) {


	app.controller('tavern.statsController', ['$scope', '$rootScope', '$state', '$timeout', 'errorService', 'characterService', 'Creature', 'Stat',
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

