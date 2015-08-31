"use strict";

(function(app) {


	app.controller('campaign.playController', ['$scope', '$rootScope', '$state', 'errorService', 'campaignService',
		function($scope, $rootScope, $state, errorService, campaignService) {
			
            $scope.pullCampaign = function() {
                
                campaignService.get({ id: $scope.campaignID },

                    function(response) {

                        $scope.campaign = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaign", error) });

                    });

            };

            $scope.pullCampaign();

        }   // end outer function

	]);			
	
}) (angular.module('CurseApp'));

