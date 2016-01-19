"use strict";

(function(app) {


	app.controller('dungeonController', ['$scope', '$rootScope', '$state', 'errorService', 'userService', 'dungeonService', 'Dungeon',

		function($scope, $rootScope, $state, errorService, userService, dungeonService, Dungeon) {

            $scope.dungeonService = dungeonService;

            if (userService.isDefinitelyNotLoggedIn())
            {
                console.log('Sending to login');
                $state.go('login');
            }


            $scope.pullDungeon = function() {
                
                if ($scope.campaignID == null)
                {
                    return;
                }

                dungeonService.dungeons.get({ campaignID: $scope.campaignID },

                    function(response) {

                        dungeonService.dungeon = new Dungeon(response);

                        // set the current character to be the first one
                        if (dungeonService.dungeon.party.length)
                        {
                            dungeonService.character = dungeonService.dungeon.party[0];
                        }

                    },
                    function(error) {

                        $rootScope.$broadcast('raise-error', { error: errorService.parse("Could not fetch dungeon", error) });

                    });

            };

            $scope.pullDungeon();

            
            $scope.$on('refresh-dungeon', function (event, args) {

                $scope.pullDungeon();

            });


        }

	]);			
	
}) (angular.module('CurseApp'));

