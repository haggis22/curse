"use strict";

(function(isNode, isAngular) {

    // This wrappers function returns the contents of the module, with dependencies
    var RoomModule = function (Exit) {

        var Room = function (room) {

            this._id = room._id;
            this.name = room.name;
            this.prep = room.prep;
            this.exits = room.exits ? room.exits.map(function(exit) { return new Exit(exit); }) : [];

            this.updated = room.updated;

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
