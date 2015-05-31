"use strict";

(function(app) {

	app.config(function($stateProvider, $urlRouterProvider) {
			
		// for any unmatched URL, redirect to main
		$urlRouterProvider.otherwise("/campaigns");
		
		$stateProvider
            .state('tavern', {
                url: "/tavern",
                templateUrl: "partials/tavern.html?v=" + (new Date()).getTime()
            })
            .state('campaigns', {
                url: "/campaigns",
                templateUrl: "js/campaigns/campaigns.html?v=" + (new Date()).getTime()
            })
            .state('campaigns.edit', {
                url: "/:campaignID",
                templateUrl: "js/campaigns/edit/campaign.html?v=" + (new Date()).getTime(),
                controller: function($scope, $stateParams) {
                    $scope.campaignID = $stateParams.campaignID;
                }
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
	
	);
	
}) (angular.module('CurseApp'));
	