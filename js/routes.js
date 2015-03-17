"use strict";

(function(app) {

	app.config(function($stateProvider, $urlRouterProvider) {
			
		// for any unmatched URL, redirect to main
		$urlRouterProvider.otherwise("/rollup");
		
		$stateProvider
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
			});
			
		}
	
	);
	
}) (angular.module('CurseApp'));
	