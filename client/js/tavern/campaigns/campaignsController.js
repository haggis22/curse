"use strict";

(function(app) {


	app.controller('campaignsController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService',
		function($scope, $rootScope, $state, errorService, campaignService) {
			
            $scope.campaigns = null;
            
            $scope.pullCampaigns = function() {
                
                campaignService.query({ id: null },

                    function(response) {

                        $scope.campaigns = response;

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

                campaignService.delete({ id: campaign.id },

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

