"use strict";

(function (app) {

    app.factory('Direction', 

		function () {

		    function Direction() 
            {
		    };

		    Direction.prototype = {

                NORTH: 1,
                EAST: 2,
                SOUTH: 3,
                WEST: 4,
                UP: 5,
                DOWN: 6,

                getDescription: function(dir)
                {
	                switch (dir)
	                {
		                case this.NORTH: 
			                return 'to the north';
		
		                case this.EAST: 
			                return 'to the east';

		                case this.SOUTH: 
			                return 'to the south';

		                case this.WEST: 
			                return 'to the west';

		                case this.UP: 
			                return 'going up';

		                case this.DOWN: 
			                return 'going down';
			
	                } 
	
	                return 'UNKNOWN DIRECTION';
                },

                opposite: function(dir)
                {
	                switch (dir)
	                {
		                case this.NORTH:
			                return this.SOUTH;
			
		                case this.SOUTH:
			                return this.NORTH;

		                case this.EAST:
			                return this.WEST;

		                case this.WEST:
			                return this.EAST;

		                case this.UP:
			                return this.DOWN;

		                case this.DOWN:
			                return this.UP;

	                }  // switch
                },

                randomDirection: function()
                {
	                var rnd = Math.random();
	                if (rnd < 0.225)
	                {
		                return this.NORTH;
	                }
	                if (rnd < 0.45)
	                {
		                return this.EAST;
	                }
	                if (rnd < 0.675)
	                {
		                return this.SOUTH;
	                }
	                if (rnd < 0.9)
	                {
		                return this.WEST;
	                }
	                if (rnd < 0.95)
	                {
		                return this.DOWN;
	                }
	                return this.UP;
                }

		    };  // prototype

		    return (Direction);

		}

	);

})(angular.module('CurseApp'));
	

