"use strict";

(function(app) {

	app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
			
		// for any unmatched URL, redirect to main
		$urlRouterProvider.otherwise("/campaigns");
		
		$stateProvider
            .state('campaigns', {
                url: "/campaigns",
                templateUrl: "js/tavern/campaigns/campaigns.html?v=" + (new Date()).getTime()
            })
            .state('campaigns.edit', {
                url: "/:campaignID",
                templateUrl: "js/tavern/campaigns/edit/campaign.html?v=" + (new Date()).getTime(),
                controller: function($scope, $stateParams) {
                    $scope.campaignID = $stateParams.campaignID;
                }
            })
            .state('campaign', {
                url: "/campaign/:campaignID",
                templateUrl: "js/tavern/campaigns/play/play.html?v=" + (new Date()).getTime(),
                controller: ['$state', '$scope', '$stateParams',
                                function($state, $scope, $stateParams) {
                                    $scope.campaignID = $stateParams.campaignID;
                                    console.log('campaignID: ' + $scope.campaignID);

                                    if ($state.is('campaign')) {
                                        $state.go('campaign.tavern');
                                    }

                                }
                            ]
            })

            .state('campaign.tavern', {
                url: "/tavern",
                templateUrl: "js/tavern/tavern.html?v=" + (new Date()).getTime(),
                // this will forward to the characters list by default
                controller: ['$scope', '$state',
                                function ($scope, $state) {
                                    // if only asking for the root path, then forward to the default
                                    if ($state.is('campaign.tavern')) {
                                        $state.go('campaign.tavern.characters');
                                    }
                                }
                            ]
            })
            .state('campaign.tavern.characters', {
                url: "/characters",
                template: "<div ui-view></div>",
                controller: ['$scope', '$state',
                                function ($scope, $state) {
                                    // if only asking for the root path, then forward to the default
                                    if ($state.is('campaign.tavern.characters')) {
                                        $state.go('campaign.tavern.characters.list');
                                    }
                                }
                            ]
            })
            .state('campaign.tavern.characters.list', {
                url: "/",
                templateUrl: "js/tavern/characters/list/characters.html?v=" + (new Date()).getTime()
            })
            .state('campaign.tavern.characters.single', {
                url: "/:characterID",
                templateUrl: "js/tavern/characters/single/single.html?v=" + (new Date()).getTime(),
                controller: ['$state', '$stateParams', 'playerService', 
                    function ($state, $stateParams, playerService) {

                        playerService.setCurrentPlayerID($stateParams.characterID);

                        // if only asking for the root path, then forward to the default
                        if ($state.is('campaign.tavern.characters.single')) {
                            $state.go('campaign.tavern.characters.single.edit');
                        }
                    }
                ]
            })
            .state('campaign.tavern.characters.single.edit', {
                url: "/edit",
                templateUrl: "js/tavern/characters/edit/edit.html?v=" + (new Date()).getTime(),
                controller: function($scope, $stateParams) {
                    $scope.characterID = $stateParams.characterID;
                }
            })
            .state('campaign.tavern.characters.single.gear', {
                url: "/gear",
                templateUrl: "js/tavern/characters/gear/gear.html?v=" + (new Date()).getTime()
            })
            .state('campaign.tavern.characters.single.shoppe', {
                url: "/shoppe",
                templateUrl: "js/tavern/characters/shoppe/shoppe.html?v=" + (new Date()).getTime()
            })
			.state('rollup', {
				url: "/rollup",
				templateUrl: "partials/rollup.html"
			})
			.state('dungeon', {
				url: "/dungeon",
				templateUrl: "partials/dungeon.html"
			})
			.state('dungeon.combat', {
				url: "/combat",
				templateUrl: "partials/combat.html"
			})
			.state('monster', {
				url: "/monster-manual",
				templateUrl: "partials/monster-manual.html"
			})

			
		}
	
	]);
	
}) (angular.module('CurseApp'));
	