"use strict";

(function(app) {

	app.service('gameService', [
		function() {

			this.plays = [];

			this.clearPlays = function()
			{
				this.plays.length = 0;
			};

            this.hasPlays = function() 
            {
                return this.plays.length > 0;
            };
			
            this.getPlays = function()
            {
                return this.plays;
            };

            this.addPlay = function(text)
            {
                this.plays.push(text);
            };

		}

	]);
	
}) (angular.module('CurseApp'));
	