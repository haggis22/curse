"use strict";

(function(app) {


	app.controller('tavernController', ['$scope', '$rootScope', '$state', 'errorService', 'userService', 'characterService', 'campaignService', 'Creature', 'Campaign',

		function($scope, $rootScope, $state, errorService, userService, characterService, campaignService, Creature, Campaign) {

            if (userService.isDefinitelyNotLoggedIn())
            {
                console.log('Sending to login');
                $state.go('login');
            }


            $scope.pullCharacters = function() {
                
                characterService.clear();

                characterService.characters.query({ id: null },

                    function(response) {

                        response.forEach(function(character) {

                            characterService.add(new Creature(character));

                        });

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch characters", error) });

                    });

            };

            $scope.getCharactersInCampaign = function(campaign) {

                var party = [];

                if (!campaign)
                {
                    return party;
                }

                characterService.getCharacters().forEach(function(character) {

                    if (character.campaignID == campaign._id)
                    {
                        party.push(character);
                    }

                });

                return party;

            };


            /* Code to pull the campaigns that the user is playing */
            $scope.pullCampaigns = function() {
                
                $scope.campaigns = [];

                campaignService.campaigns.query({ id: null },

                    function(response) {

                        // convert the JSON objects to proper Campaign objects
                        campaignService.myCampaigns = response.map(function(campaign) { return new Campaign(campaign); });

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch campaigns", error) });

                    });

            };

            $scope.getCampaignForCharacter = function(character) {

                if (!character || !character.campaignID || !campaignService.myCampaigns)
                {
                    return null;
                }

                for (var c=0; c < campaignService.myCampaigns.length; c++)
                {
                    if (campaignService.myCampaigns[c]._id == character.campaignID)
                    {
                        return campaignService.myCampaigns[c];
                    }
                }

                // did not find campaign
                return null;

            };


        }

	]);			
	
}) (angular.module('CurseApp'));

