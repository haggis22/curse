"use strict";

(function(app) {


	app.controller('campaignsController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService', 'Campaign',
		function($scope, $rootScope, $state, errorService, campaignService, Campaign) {


            /* Code to pull all the modules available to run */
            $scope.modules = null;
            
            $scope.pullModules = function() {
                
                $scope.modules = [];

                campaignService.modules.query({},

                    function(response) {

                        var modules = [];

                        response.forEach(function(module) {

                            modules.push(new Campaign(module));

                        });

                        $scope.modules = modules;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch modules", error) });

                    });

            };

            $scope.pullModules();


            $scope.startCampaign = function(module) {

                campaignService.moduleStart.start({ id: module._id },

                    function(response) {

                        // we have created a new campaign, so refresh the list
                        $scope.pullCampaigns();

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not start campaign", error) });

                    });



            };


			
            /* Code to pull the campaigns that the user is playing */
            $scope.campaigns = null;
            
            $scope.pullCampaigns = function() {
                
                $scope.campaigns = [];

                campaignService.campaigns.query({ id: null },

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

                campaignService.campaigns.delete({ id: campaign._id },

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

