"use strict";

(function(app) {

	app.service('playerService', [ '$resource', 'Player', 'diceService',

		function($resource, Player, diceService) {

			this.players = [];

            this.currentPlayer = null;

            this.newPlayer = function()
            {
                var player = new Player();
                this.players.push(player);
                return player;
            };

            this.hasPlayers = function()
            {
                if ((this.players == null) || (this.players.length == 0) || (this.players[0].str == 0))
                {
                    return false;
                }

                return true;
            };

            this.numLivingPlayers = function()
            {
                var count = 0;
                for (var p=0; p < this.players.length; p++)
                {
                    if (this.players[p].isAlive())
                    {
                        count++;
                    }
                }

                return count;
            }


            this.allDead = function()
            {
                for (var p=0; p < this.players.length; p++)
                {
                    if (this.players[p].isAlive())
                    {
                        return false;
                    }
                }

                return true;
            };

            this.randomLivingPlayer = function() 
            {
                var livers = [];

                for (var p=0; p < this.players.length; p++)
                {
                    if (this.players[p].isAlive())
                    {
                        livers.push(this.players[p]);
                    }
                }

                if (livers.length == 0)
                {
                    return null;
                }

                return livers[diceService.rollDie(0, livers.length - 1)];
            };

            this.characterClient = function()
            {
                return $resource('/api/characters/:name');
/*
                    return $resource('http://z-10929:8081/tath/job/results/:submissionHash', { submissionHash: '@submissionHash' }, {
                        'query': { method: 'GET', headers: { 'session': viewService.getToken() } },
                        'delete': { method: 'DELETE', headers: { 'session': viewService.getToken() } }
                    });
*/
            
            };


		}


	]);
	
}) (angular.module('CurseApp'));
	