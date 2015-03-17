"use strict";

(function(app) {

	app.service('playerService', [ 'Player',

		function(Player) {

			this.players = [];

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

            this.allDead = function()
            {
                for (var p=0; p < this.players.length; p++)
                {
                    if (this.players[p].health > 0)
                    {
                        return false;
                    }
                }

                return true;
            };


		}


	]);
	
}) (angular.module('CurseApp'));
	