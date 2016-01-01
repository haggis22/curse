"use strict";

(function(app) {

	app.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

		// for any unmatched URL, redirect to main
		$urlRouterProvider.otherwise("/login");
		
		$stateProvider

            .state('login', { 
                url: "/login",
                templateUrl: "js/users/login/login.html?v=" + (new Date()).getTime()
            })

            .state('tavern', {
                url: "/tavern",
                templateUrl: "js/tavern/tavern.html?v=" + (new Date()).getTime(),
                // this will forward to the characters list by default
                controller: ['$scope', '$state',
                                function ($scope, $state) {
                                    // if only asking for the root path, then forward to the default
                                    if ($state.is('tavern')) {
                                        $state.go('tavern.characters');
                                    }
                                }
                            ]
            })

            .state('tavern.characters', {
                url: "/characters",
                template: "<div ui-view></div>",
                controller: ['$scope', '$state',
                                function ($scope, $state) {
                                    // if only asking for the root path, then forward to the default
                                    if ($state.is('tavern.characters')) {
                                        $state.go('tavern.characters.list');
                                    }
                                }
                            ]
            })
            .state('tavern.characters.list', {
                url: "/",
                templateUrl: "js/tavern/characters/list/characters.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.create', {
                url: "/create",
                templateUrl: "js/tavern/characters/create/create.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.edit', {
                url: "/:characterID",
                templateUrl: "js/tavern/characters/edit/edit.html?v=" + (new Date()).getTime(),
                controller: ['$scope', '$state', '$stateParams', 
                    function ($scope, $state, $stateParams) {

                        $scope.characterID = null;
                        if ($stateParams.characterID && $stateParams.characterID.length > 0)
                        {
                            $scope.characterID = $stateParams.characterID;
                        }

                        // if only asking for the root path, then forward to the default
                        if ($state.is('tavern.characters.edit')) {
                            $state.go('tavern.characters.edit.stats');
                        }
                    }
                ]
            })
            .state('tavern.characters.edit.bio', {
                url: "/bio",
                templateUrl: "js/tavern/characters/edit/bio/bio.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.edit.stats', {
                url: "/stats",
                templateUrl: "js/tavern/characters/edit/stats/stats.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.edit.skills', {
                url: "/skills",
                templateUrl: "js/tavern/characters/edit/skills/skills.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.edit.gear', {
                url: "/gear",
                templateUrl: "js/tavern/characters/edit/gear/gear.html?v=" + (new Date()).getTime()
            })
            .state('tavern.characters.edit.shoppe', {
                url: "/shoppe",
                templateUrl: "js/tavern/characters/edit/shoppe/shoppe.html?v=" + (new Date()).getTime()
            })



            .state('tavern.campaigns', {
                url: "/campaigns",
                templateUrl: "js/tavern/campaigns/campaigns.html?v=" + (new Date()).getTime()
            })
            .state('tavern.campaigns.edit', {
                url: "/:campaignID",
                templateUrl: "js/tavern/campaigns/edit/campaign.html?v=" + (new Date()).getTime(),
                controller: function($scope, $stateParams) {
                    $scope.campaignID = $stateParams.campaignID;
                }
            })
            .state('tavern.campaign', {
                url: "/campaign/:campaignID",
                templateUrl: "js/tavern/campaigns/play/play.html?v=" + (new Date()).getTime(),
                controller: ['$state', '$scope', '$stateParams',
                                function($state, $scope, $stateParams) {
                                    $scope.campaignID = $stateParams.campaignID;


                                }
                            ]
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
	