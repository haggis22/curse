"use strict";

(function(app) {

	app.service('gameService', [
		function() {

			this.actions = [];

			this.clearActions = function()
			{
				this.actions.length = 0;
			}
			
		}

	]);
	
}) (angular.module('CurseApp'));
	