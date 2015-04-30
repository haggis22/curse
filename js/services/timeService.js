"use strict";

(function(app) {

	app.service('timeService', ['diceService', 

		function(diceService) {
			
            this.date = new Date(2015, 1, 1, 8, 0, 0);

            this.addRounds = function(numRounds)
            {
                if (numRounds == null)
                {
                    numRounds = 1;
                }

                this.date.setSeconds(this.date.getSeconds() + diceService.rollDie(7, 13));
            };

            this.addTurns = function(numTurns)
            {
                if (numTurns == null)
                {
                    numTurns = 1;
                }

                this.date.setSeconds(this.date.getSeconds() + diceService.averageDie(300, 600));
            };
		
		}
	
    ]);
	
}) (angular.module('CurseApp'));
	