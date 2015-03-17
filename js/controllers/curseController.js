"use strict";

(function(app) {

	app.controller('curseController', [ '$scope', 'viewService',

		function($scope, viewService) {
			
			$scope.player =
			{
				name: 'Zogarth',
				str: 10,
				int: 10,
				dex: 10,
				health: 20
			};
			
		}
	]);
	
}) (angular.module('CurseApp'));
	