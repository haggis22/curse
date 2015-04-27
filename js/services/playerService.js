"use strict";

(function(app) {

	app.service('playerService', [ 'Player',

		function(Player) {

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


		}


	]);
	
}) (angular.module('CurseApp'));
	