"use strict";

(function (app) {

    app.factory('Exit', ['Direction',

		function (Direction) {

		    function Exit(desc, dir, roomID, isSecret) {
		        this.desc = desc;
                this.dir = dir;
                this.roomID = roomID;
                this.isSecret = isSecret == null ? false : isSecret;
		    };

		    Exit.prototype = {

                getDirection: function()
                {
	                return Direction.prototype.getDescription(this.dir);
                }

		    };  // prototype

		    return (Exit);

		}

	]);

})(angular.module('CurseApp'));
	

