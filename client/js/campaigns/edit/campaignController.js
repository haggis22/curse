"use strict";

(function(app) {


	app.controller('campaignController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService',
		function($scope, $rootScope, $state, errorService, campaignService) {
			
            $scope.campaigns = null;
            
            $scope.pullCampaign = function() {
                
                if (($scope.campaignID == null) || ($scope.campaignID == ''))
                {
                    $scope.campaign = {};
                    return;
                }                        

                campaignService.get({ id: $scope.campaignID },

                    function(response) {

                        $scope.campaign = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaign", error) });

                    });

            };

            $scope.pullCampaign();

            $scope.saveCampaign = function(isValid) {

                $scope.submitted = true;
            
                if (!isValid)
                {
                    return;
                }

                console.log('saving campaign');
//                campaignService.save({ id: $scope.campaignID }, $scope.campaign,
                campaignService.save({ id: 'testID' }, $scope.campaign,

                    function(response) {
                        
                        console.log(response.message);
                        $state.go('campaigns', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not save campaign", error) });

                    });

            }

/*
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

