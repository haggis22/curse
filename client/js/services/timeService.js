"use strict";

(function(app) {

	app.service('timeService', ['diceService', 'playerService',

		function(diceService, playerService) {
			
            this.START_TIME = new Date(2015, 1, 1, 8, 0, 0);
            this.date = this.START_TIME;

            this.addRounds = function(numRounds)
            {
                if (numRounds == null)
                {
                    numRounds = 1;
                }

                this.date.setSeconds(this.date.getSeconds() + diceService.rollDie(7, 13));
                this.checkTime();
            };

            this.addTurns = function(numTurns)
            {
                if (numTurns == null)
                {
                    numTurns = 1;
                }

                this.date.setSeconds(this.date.getSeconds() + diceService.averageDie(180, 360));
                this.checkTime();
            };


            this.checkTime = function()
            {
                for (var p=0; p < playerService.players.length; p++)
                {
                    playerService.players[p].checkTime(this.date);
                }
            };
		
		}
	
    ]);
	
}) (angular.module('CurseApp'));
	