"use strict";

(function(app) {


	app.controller('campaign.editController', ['$scope', '$rootScope', '$state', '$q', 'errorService', 'campaignService', 'characterService', 'Creature',
		function($scope, $rootScope, $state, $q, errorService, campaignService, characterService, Creature) {
			
            $scope.characterService = characterService;

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

            $scope.pullCharacters();


            $scope.isInParty = function(character) 
            {
                if (!character || !$scope.campaign || !$scope.campaign._id)
                {
                    return false;
                }

                return character.campaignID == $scope.campaign._id;
            };

            $scope.checkAvailability = function(character)
            {
                return character.campaignID == null;
            };

            $scope.addCharacterToCampaign = function(character)
            {
                campaignService.characters.save({ action: 'add', campaignID: $scope.campaign._id, characterID: character._id },

                    function(response) {

                        // update the page
                        $scope.pullCampaign();
                        $scope.pullCharacters();

                    },
                    function(error) {
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not add character to campaign", error) });

                    });

            };

            $scope.removeCharacterFromCampaign = function(character)
            {
                campaignService.characters.save({ action: 'remove', campaignID: $scope.campaign._id, characterID: character._id },

                    function(response) {

                        // update the page
                        $scope.pullCampaign();
                        $scope.pullCharacters();

                    },
                    function(error) {
                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not remove character to campaign", error) });

                    });

            };

/*
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

            };  // updateCampaign
*/


        }

	]);			
	
}) (angular.module('CurseApp'));

