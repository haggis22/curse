"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var RoomModule = function (Exit) {

        var Room = function (room) {

            if (room)
            {
                this._id = room._id;
                this.name = room.name;
                this.prep = room.prep;
                this.exits = room.exits ? room.exits.map(function(exit) { return new Exit(exit); }) : [];
            }

            if (!this.exits)
            {
                this.exits = [];
            }

        };

        Room.prototype.findExit = function(exitID)
        {
            for (var x=0; x < this.exits.length; x++)
            {
                if (this.exits[x]._id.toString() == exitID)
                {
                    return this.exits[x];
                }
            }

            return null;

        };

        return Room;

    };

    if (isAngular) 
    {
        // AngularJS module definition
        angular.module('CurseApp').
            factory('Room', ['Exit', RoomModule]);

    } else if (isNode) {
        // NodeJS module definition
        module.exports = RoomModule
        (
            require(__dirname + '/Exit')
        );
    }

}) (typeof module !== 'undefined' && module.exports, typeof angular !== 'undefined'); 
