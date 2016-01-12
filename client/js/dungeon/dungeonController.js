"use strict";

(function(app) {


	app.controller('dungeonController', ['$scope', '$rootScope', '$state', 'errorService', 'userService', 'characterService', 'campaignService', 'Creature',

		function($scope, $rootScope, $state, errorService, userService, characterService, campaignService, Creature) {

            $scope.campaignService = campaignService;
            $scope.characterService = characterService;

            if (userService.isDefinitelyNotLoggedIn())
            {
                console.log('Sending to login');
                $state.go('login');
            }


            $scope.pullCampaign = function(campaignID) {
                
                if (campaignID == null)
                {
                    return;
                }

                campaignService.campaigns.get({ id: $scope.campaignID },

                    function(response) {

                        campaignService.current = response;

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch current campaign", error) });

                    });

            };

            if (campaignService.current == null)
            {
                $scope.pullCampaign($scope.campaignID);
            }

            $scope.pullParty = function() {
                
                characterService.clear();

                characterService.byCampaign.query({ campaignID: $scope.campaignID },

                    function(response) {

                        response.forEach(function(character) {

                            characterService.add(new Creature(character));

                        });

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch party characters", error) });

                    });

            };

            $scope.pullParty();



        }

	]);			
	
}) (angular.module('CurseApp'));

