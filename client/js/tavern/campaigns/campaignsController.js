"use strict";

(function(app) {


	app.controller('campaignsController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService', 'Campaign',
		function($scope, $rootScope, $state, errorService, campaignService, Campaign) {
			
            $scope.campaigns = null;
            
            $scope.pullCampaigns = function() {
                
                $scope.campaigns = [];

                campaignService.query({ id: null },

                    function(response) {

                        var campaigns = [];

                        response.forEach(function(campaign) {

                            campaigns.push(new Campaign(campaign));

                        });

                        $scope.campaigns = campaigns;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaigns", error) });

                    });

            };

            $scope.pullCampaigns();


            $scope.deleteCampaign = function(campaign) {

                if (!confirm('Are you sure you want to delete the campaign "' + campaign.name + '" ?'))
                {
                    return;
                }

                campaignService.delete({ id: campaign._id },

                    function(response) {

                        $scope.pullCampaigns();

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not delete campaign", error) });

                    });



            };

        }

	]);			
	
}) (angular.module('CurseApp'));

