"use strict";

(function(app) {


	app.controller('campaignController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService',
		function($scope, $rootScope, $state, errorService, campaignService) {
			
            $scope.isNewCampaign = function() {

                return $scope.campaignID == null || $scope.campaignID.length == 0;

            };

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


            $scope.createCampaign = function() {

                campaignService.create({}, $scope.campaign,

                    function(response) {
                        
                        console.log(response.message);
                        $state.go('tavern.campaigns', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create campaign", error) });

                    });

            };

            $scope.updateCampaign = function() {

                campaignService.update({ id: $scope.campaignID }, $scope.campaign,

                    function(response) {
                        
                        console.log(response.message);
                        $state.go('tavern.campaigns', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not update campaign", error) });

                    });

            };

            $scope.saveCampaign = function(isValid) {

                $scope.submitted = true;
            
                if (!isValid)
                {
                    return;
                }

                if ($scope.campaignID)
                {
                    $scope.updateCampaign();
                }
                else
                {
                    $scope.createCampaign();
                }

            }

        }

	]);			
	
}) (angular.module('CurseApp'));

