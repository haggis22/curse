"use strict";

(function(app) {


	app.controller('tavernController', ['$scope', '$rootScope', '$state', 'errorService', 
		function($scope, $rootScope, $state, errorService) {
			
/*

            $scope.campaigns = null;
            
            $scope.pullCampaigns = function() {
                
                campaignService.query(

                    function(response) {

                        $scope.campaigns = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaigns", error) });

                    });

            };

            $scope.pullCampaigns();

            $scope.char = null;

            $scope.pullChar = function(name) {
                
                playerService.characterClient().get({ name: name },
                    function(response) {

                        $scope.char = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch character (single)", error) });

                    });



            };

            $scope.pullChar('Zogarth');
*/
        }

	]);			
	
}) (angular.module('CurseApp'));

