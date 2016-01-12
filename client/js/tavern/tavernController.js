"use strict";

(function(app) {


	app.controller('tavernController', ['$scope', '$rootScope', '$state', 'errorService', 'userService', 'characterService', 'Creature',

		function($scope, $rootScope, $state, errorService, userService, characterService, Creature) {

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


        }

	]);			
	
}) (angular.module('CurseApp'));

