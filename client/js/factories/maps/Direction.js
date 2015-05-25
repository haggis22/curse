"use strict";

(function (app) {

    app.factory('Direction', 

		function () {

		    function Direction() 
            {
		    };

		    Direction.prototype = {

                NORTH: 1,
                NORTHEAST: 2,
                EAST: 3,
                SOUTHEAST: 4,
                SOUTH: 5,
                SOUTHWEST: 6,
                WEST: 7,
                NORTHWEST: 8,
                UP: 9,
                DOWN: 10,

                getDescription: function(dir)
                {
	                switch (dir)
	                {
		                case this.NORTH: 
			                return 'to the north';
		
		                case this.NORTHEAST: 
			                return 'to the northeast';

		                case this.EAST: 
			                return 'to the east';

		                case this.SOUTHEAST: 
			                return 'to the southeast';

		                case this.SOUTH: 
			                return 'to the south';

		                case this.SOUTHWEST: 
			                return 'to the southwest';

		                case this.WEST: 
			                return 'to the west';

		                case this.NORTHWEST: 
			                return 'to the northwest';

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
			
		                case this.NORTHEAST:
                            return this.SOUTHWEST;

		                case this.EAST:
			                return this.WEST;

		                case this.SOUTHEAST:
                            return this.NORTHWEST;

		                case this.SOUTH:
			                return this.NORTH;

		                case this.SOUTHWEST:
                            return this.NORTHEAST;

		                case this.WEST:
			                return this.EAST;

		                case this.NORTHWEST:
                            return this.SOUTHEAST;

		                case this.UP:
			                return this.DOWN;

		                case this.DOWN:
			                return this.UP;

	                }  // switch
                },

                randomDirection: function()
                {
	                var rnd = Math.random();
	                if (rnd < 0.11)
	                {
		                return this.NORTH;
	                }
	                if (rnd < 0.22)
	                {
		                return this.NORTHEAST;
	                }
	                if (rnd < 0.33)
	                {
		                return this.EAST;
	                }
	                if (rnd < 0.44)
	                {
		                return this.SOUTHEAST;
	                }
	                if (rnd < 0.55)
	                {
		                return this.SOUTH;
	                }
	                if (rnd < 0.66)
	                {
		                return this.SOUTHWEST;
	                }
	                if (rnd < 0.77)
	                {
		                return this.WEST;
	                }
	                if (rnd < 0.88)
	                {
		                return this.NORTHWEST;
	                }
	                if (rnd < 0.94)
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
	

