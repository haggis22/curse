"use strict";

(function(app) {


	app.controller('campaign.editController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService',
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

                campaignService.campaigns.get({ id: $scope.campaignID },

                    function(response) {

                        $scope.campaign = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaign", error) });

                    });

            };

            $scope.pullCampaign();


            $scope.createCampaign = function() {

                campaignService.campaigns.create({}, $scope.campaign,

                    function(response) {
                        
                        console.log(response.message);
                        $state.go('tavern.campaigns', {}, { reload: true });

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not create campaign", error) });

                    });

            };

            $scope.updateCampaign = function(isValid) {

                $scope.submitted = true;
            
                if (!isValid)
                {
                    return;
                }

                campaignService.campaigns.update({ id: $scope.campaignID }, $scope.campaign,

                    function(response) {
                        
                        if (response)
                        {
                            console.log('Campaign saved successfully');
                            $state.go('tavern.campaigns', {}, { reload: true });
                        }
                        else
                        {
                            console.warn('Campaign save FAILED!');
                        }

                    },
                    function(error) {

                        console.log(error);
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not update campaign", error) });

                    });

            };

        }

	]);			
	
}) (angular.module('CurseApp'));

